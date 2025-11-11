import { PrismaClient } from "@prisma/client";
import { checkAdmin } from "../utils/userControllerUtils.js";
const prisma = new PrismaClient();

export const createEmployee = async (req, res) => {
  try {
    await checkAdmin(req.user);
    const employeeData = req.body;
    const employee = await prisma.employee.create({
      data: {
        customId: employeeData.customId,
        name: employeeData.name,
        phoneNumber: employeeData.phoneNumber,
        email: employeeData.email,
        status: employeeData.status || "ACTIVE",
        designation: employeeData.designation,
        department: employeeData.department,
      },
    });
    return res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
     // Handle Prisma unique constraint error for duplicate customId
    if (error.code === "P2002" && error.meta?.target?.includes("customId")) {
      return res.status(400).json({ message: "Custom ID already exists, please choose another." });
    }
  }
}

export const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      // Only add department filter if search matches a valid enum value
      const validDepartments = [
        "MERCHANDISING",
        "MANAGEMENT",
        "IT",
        "CAD_ROOM",
        "SAMPLE_FABRIC",
        "SAMPLE_SEWING"
      ];
      where.OR = [
        { customId: { contains: search } },
        { email: { contains: search } },
        { designation: { contains: search } },
        ...(validDepartments.includes(search)
          ? [{ department: { equals: search } }]
          : [])
      ];
    }

    const employees = await prisma.employee.findMany({
      where,
      skip: skip,
      take: limit,
      orderBy: { customId: 'desc' },
      include: { user: true },
    });

    const totalEmployees = await prisma.employee.count({ where });

    const totalPages = Math.ceil(totalEmployees / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalEmployees: totalEmployees,
        limit: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        search: search || null,
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Error fetching employees', error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    // Only admins can update employees
    await checkAdmin(req.user);

    const { id } = req.params;
    const employeeId = parseInt(id, 10);
    if (Number.isNaN(employeeId)) {
      return res.status(400).json({ success: false, message: "Invalid employee id" });
    }

    const payload = req.body || {};

    // Validate status if provided
    const validStatuses = ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];
    if (payload.status && !validStatuses.includes(payload.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status. Must be one of: " + validStatuses.join(", ") });
    }

    // Validate department if provided
    const validDepartments = [
      "MERCHANDISING",
      "MANAGEMENT",
      "IT",
      "CAD_ROOM",
      "SAMPLE_FABRIC",
      "SAMPLE_SEWING",
    ];
    if (payload.department && !validDepartments.includes(payload.department)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department. Must be one of: " + validDepartments.join(", ") });
    }

    // Ensure employee exists
    const existing = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        // only update provided fields, otherwise keep existing
        customId: payload.customId ?? existing.customId,
        name: payload.name ?? existing.name,
        phoneNumber: payload.phoneNumber ?? existing.phoneNumber,
        email: payload.email ?? existing.email,
        status: payload.status ?? existing.status,
        designation: payload.designation ?? existing.designation,
        department: payload.department ?? existing.department,
      },
      include: { user: true },
    });

    res.status(200).json({ success: true, data: updatedEmployee, message: "Employee updated successfully" });
  } catch (error) {
    // Handle Prisma unique constraint error for duplicate customId/email
    if (error?.code === "P2002" && Array.isArray(error.meta?.target)) {
      const target = error.meta.target;
      if (target.includes("customId")) {
        return res.status(400).json({ success: false, message: "Custom ID already exists, please choose another." });
      }
      if (target.includes("email")) {
        return res.status(400).json({ success: false, message: "Email already exists, please choose another." });
      }
    }

    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: "Error updating employee", error: error.message });
  }
};