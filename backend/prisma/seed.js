import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



/* 

admin — password: admin123 (role: ADMIN, email: admin@tna.com)
manager — password: manager123 (role: MANAGEMENT, email: manager@tna.local)
merch — password: merch123 (role: MERCHANDISER, email: merch@tna.local)
caduser — password: cad123 (role: CAD, email: cad@tna.local)
samplefab — password: sf123 (role: SAMPLE_FABRIC, email: samplefab@tna.local)
sampleroom — password: sr123 (role: SAMPLE_ROOM, email: sampleroom@tna.local)

*/


async function main() {
  console.log("Start seeding...");

  // Employees and Users (unique fields used to be idempotent)
  let employee = await prisma.employee.findUnique({
    where: { customId: "EMP_SEED_1" },
  });
  if (!employee) {
    employee = await prisma.employee.create({
      data: {
        customId: "EMP001",
        name: "Admin",
        email: "admin@tna.com",
        status: "ACTIVE",
        designation: "System Administrator",
        department: "IT",
      },
    });
    console.log("Created employee:", employee.customId);
  } else {
    console.log("Employee exists:", employee.customId);
  }

  const adminUserName = "admin";
  let user = await prisma.user.findUnique({
    where: { userName: adminUserName },
  });
  if (!user) {
    const hashed = await bcrypt.hash("admin123", 10);
    user = await prisma.user.create({
      data: {
        userName: adminUserName,
        password: hashed,
        role: "ADMIN",
        employeeId: employee.id,
      },
    });
    console.log("Created user:", user.userName);
  } else {
    console.log("User exists:", user.userName);
  }

  // Create additional test users (idempotent)
  const testAccounts = [
    { userName: "manager", password: "manager123", role: "MANAGEMENT", email: "manager@tna.local", customId: "EMP_SEED_MANAGER" },
    { userName: "merch", password: "merch123", role: "MERCHANDISER", email: "merch@tna.local", customId: "EMP_SEED_MERCH" },
    { userName: "caduser", password: "cad123", role: "CAD", email: "cad@tna.local", customId: "EMP_SEED_CAD" },
    { userName: "samplefab", password: "sf123", role: "SAMPLE_FABRIC", email: "samplefab@tna.local", customId: "EMP_SEED_SAMPLEFAB" },
    { userName: "sampleroom", password: "sr123", role: "SAMPLE_ROOM", email: "sampleroom@tna.local", customId: "EMP_SEED_SAMPLEROOM" },
  ];

  for (const acct of testAccounts) {
    let existing = await prisma.user.findUnique({ where: { userName: acct.userName } });
    if (existing) {
      console.log("User exists:", acct.userName);
      continue;
    }

    // create employee for this user (if not exists by customId)
    let emp = await prisma.employee.findUnique({ where: { customId: acct.customId } });
    if (!emp) {
      emp = await prisma.employee.create({
        data: {
          customId: acct.customId,
          name: acct.userName,
          email: acct.email,
          status: "ACTIVE",
          designation: acct.role,
          department: "MERCHANDISING",
        },
      });
      console.log("Created employee for user:", acct.userName);
    }

    const hashedPw = await bcrypt.hash(acct.password, 10);
    const newUser = await prisma.user.create({
      data: {
        userName: acct.userName,
        password: hashedPw,
        role: acct.role,
        employeeId: emp.id,
      },
    });
    console.log("Created user:", newUser.userName);
  }

  // Department (no unique constraint on name in schema) - safe create-if-missing
  let department = await prisma.department.findFirst({
    where: { name: "IT Department" },
  });
  if (!department) {
    department = await prisma.department.create({
      data: { name: "IT Department", contactPerson: "Seed Contact" },
    });
    console.log("Created department: IT Department");
  }

  // Buyer
  let buyer = await prisma.buyer.findFirst({ where: { name: "Seed Buyer" } });
  if (!buyer) {
    buyer = await prisma.buyer.create({
      data: { name: "Seed Buyer", country: "Local" },
    });
    console.log("Created buyer: Seed Buyer");
  }

  // Style
  let style = await prisma.style.findFirst({ where: { name: "Seed Style" } });
  if (!style) {
    style = await prisma.style.create({ data: { name: "Seed Style" } });
    console.log("Created style: Seed Style");
  }

  // Create a TNA linked to buyer and user
  const tna = await prisma.tNA.create({
    data: {
      style: "Seed Style",
      itemName: "Sample Item",
      sampleSendingDate: new Date(),
      orderDate: new Date(),
      merchandiser: { connect: { id: user.id } },
      buyer: { connect: { id: buyer.id } },
      sampleType: "DVP",
    },
  });
  console.log("Created TNA id:", tna.id);

  // CostSheet
  const costSheet = await prisma.costSheet.create({
    data: {
      styleId: style.id,
      item: "Seed Item",
      group: "General",
      size: "M",
      fabricType: "Cotton",
      gsm: "180",
      color: "Blue",
      quantity: 100,
      createdById: user.id,
      name: "Seed CostSheet",
      cadRows: [],
      fabricRows: [],
      trimsRows: [],
      othersRows: [],
      summaryRows: {},
    },
  });
  console.log("Created CostSheet id:", costSheet.id);

  // Trims and Accessories
  const trims = await prisma.trimsAndAccessories.create({
    data: {
      name: "Seed Trims",
      trimsRows: { items: [{ name: "Button", qty: 10 }] },
      createdById: user.id,
    },
  });
  console.log("Created Trims id:", trims.id);

  // FabricBooking
  const fabricBooking = await prisma.fabricBooking.create({
    data: {
      createdById: user.id,
      receiveDate: new Date(),
      completeDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      tnaId: tna.id,
    },
  });
  console.log("Created FabricBooking id:", fabricBooking.id);

  // SampleDevelopment
  const sampleDev = await prisma.sampleDevelopment.create({
    data: {
      createdById: user.id,
      samplemanName: "Seed Sample",
      sampleQuantity: 10,
      tnaId: tna.id,
    },
  });
  console.log("Created SampleDevelopment id:", sampleDev.id);

  // DHL Tracking
  const dhl = await prisma.dHLTracking.create({
    data: {
      date: new Date(),
      trackingNumber: "SEEDTRACK123",
      tnaId: tna.id,
    },
  });
  console.log("Created DHLTracking id:", dhl.id);

  // AuditLog
  const audit = await prisma.auditLog.create({
    data: {
      user: user.userName,
      userRole: user.role,
      action: "seed",
      resource: "seed",
      resourceId: String(user.id),
      description: "Initial seed data created",
      ipAddress: "127.0.0.1",
      userAgent: "seed-script",
      status: "SUCCESS",
    },
  });
  console.log("Created AuditLog id:", audit.id);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
