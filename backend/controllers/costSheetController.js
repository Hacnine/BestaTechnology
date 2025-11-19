import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllCostSheets = async (req, res) => {
  const currentUserId = req.user?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search?.trim() || "";
  const offset = (page - 1) * limit;
  const orderBy = req.query.orderBy || "own";

  try {
    // Build search filter (search by style name or item)
    let where = {};
    if (search) {
      where = {
        OR: [
          { item: { contains: search } },
          { style: { name: { contains: search } } },
          { name: { contains: search } },
        ],
      };
    }

    let totalCostSheets = 0;
    let costSheets = [];

    if (orderBy === "own") {
      // Only show current user's cost sheets
      const ownWhere = { ...where, createdById: currentUserId };
      totalCostSheets = await prisma.costSheet.count({ where: ownWhere });

      costSheets = await prisma.costSheet.findMany({
        where: ownWhere,
        include: { style: true, createdBy: true },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Show all cost sheets
      totalCostSheets = await prisma.costSheet.count({ where });
      costSheets = await prisma.costSheet.findMany({
        where,
        include: { style: true, createdBy: true },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
    }

    // Remove password from createdBy
    const sanitized = costSheets.map((cs) => ({
      ...cs,
      createdBy: cs.createdBy ? { ...cs.createdBy, password: undefined } : null,
    }));

    const totalPages = Math.ceil(totalCostSheets / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      page,
      limit,
      data: sanitized, // Changed from 'sanitized' to 'data' for clarity
      totalPages,
      hasNextPage,
      hasPrevPage,
      search: search || null,
      totalCount: totalCostSheets, // Added total count for clarity
    });
  } catch (error) {
    console.error("Error fetching cost sheets:", error);
    res.status(500).json({ error: "Failed to fetch cost sheets" });
  }
};

export const getCostSheetById = async (req, res) => {
  try {
    const { id } = req.params;
    const costSheet = await prisma.costSheet.findUnique({
      where: { id: Number(id) },
      include: { style: true, createdBy: true },
    });
    if (!costSheet) return res.status(404).json({ error: "Not found" });
    // Remove password from createdBy
    if (costSheet.createdBy) costSheet.createdBy.password = undefined;
    res.json(costSheet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cost sheet" });
  }
};

export const checkStyle = async (req, res) => {
  try {
    const { style } = req.query;

    if (!style) return res.status(400).json({ error: "Style is required" });

    // Find style by name first
    const styleRecord = await prisma.style.findFirst({
      where: { name: String(style) },
    });

    if (!styleRecord) {
      return res.json({ exists: false });
    }

    // Check for any cost sheet for this style created in the current year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    const recentCostSheet = await prisma.costSheet.findFirst({
      where: {
        styleId: styleRecord.id,
        createdAt: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      include: { createdBy: { select: { id: true, userName: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (recentCostSheet) {
      return res.json({
        exists: true,
        creatorName: recentCostSheet.createdBy.userName,
      });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check style" });
  }
};

export const createCostSheet = async (req, res) => {
  try {
    // Handle FormData: parse JSON strings back to objects
    let data = req.body;

    // If data is FormData, some fields might be JSON strings that need parsing
    const parseIfJson = (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    };

    // Parse complex fields that might be JSON strings
    if (typeof data.cadConsumption === "string")
      data.cadConsumption = parseIfJson(data.cadConsumption);
    if (typeof data.fabricCost === "string")
      data.fabricCost = parseIfJson(data.fabricCost);
    if (typeof data.trimsAccessories === "string")
      data.trimsAccessories = parseIfJson(data.trimsAccessories);
    if (typeof data.summary === "string")
      data.summary = parseIfJson(data.summary);
    if (typeof data.others === "string") data.others = parseIfJson(data.others);

    // Convert style to lowercase for letters only
    const normalizedStyle =
      typeof data.style === "string"
        ? data.style.replace(/[A-Za-z]+/g, (match) => match.toLowerCase())
        : data.style;

    // Find or create style
    let style = await prisma.style.findFirst({
      where: { name: normalizedStyle },
    });
    if (!style) {
      style = await prisma.style.create({ data: { name: normalizedStyle } });
    }

    // Handle image upload - generate URL if file was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/images/${req.file.filename}`;
    }

    // Ensure all JSON fields are present. Accept either `styleRows` (preferred) or legacy `styleJson`.
    const styleRows = data.styleRows
      ? parseIfJson(data.styleRows)
      : data.styleJson
      ? parseIfJson(data.styleJson)
      : {};
    const cadRows = data.cadConsumption ?? {};
    const fabricRows = data.fabricCost ?? {};
    const trimsRows = data.trimsAccessories ?? {};
    const othersRows = data.others ?? {};
    const summaryRows = data.summary ?? {};

    // Save all required fields from frontend
    const costSheet = await prisma.costSheet.create({
      data: {
        styleId: style.id,
        item: data.item,
        group: data.group,
        size: data.size,
        fabricType: data.fabricType,
        gsm: data.gsm,
        color: data.color,
        quantity: Number(data.qty) || 0,
        buyer: data.buyer,
        brand: data.brand,
        image: imageUrl,
        createdById: req.user.id,
        name: data.name || req.user.userName,
        styleRows: styleRows,
        cadRows,
        fabricRows,
        trimsRows,
        othersRows,
        summaryRows,
      },
    });
    res.status(201).json(costSheet);
  } catch (error) {
    console.error("Create CostSheet Error:", error);
    console.error("Incoming Data:", req.body);
    res
      .status(500)
      .json({ error: "Failed to create cost sheet", details: error.message });
  }
};

export const updateCostSheet = async (req, res) => {
  try {
    const { id } = req.params;

    // Handle FormData: if req.body.data exists, it's JSON string, otherwise use req.body directly
    let incoming;
    if (req.body.data) {
      // FormData case: data is JSON string
      incoming = JSON.parse(req.body.data);
    } else {
      // Regular JSON case
      incoming = req.body.data ? req.body.data : req.body;
    }
    // helper to parse JSON strings when fields are passed as strings (FormData)
    const parseIfJson = (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    };

    // Handle image upload - generate URL if file was uploaded
    let imageUrl = incoming.image; // Keep existing image URL by default
    if (req.file) {
      imageUrl = `/uploads/images/${req.file.filename}`;
    }

    // Defensive mapping for all fields except 'style'
    const updateData = {
      // Do NOT include 'style' here!
      item: incoming.item,
      group: incoming.group,
      size: incoming.size,
      fabricType: incoming.fabricType,
      gsm: incoming.gsm,
      color: incoming.color,
      quantity: Number(incoming.quantity) || Number(incoming.qty) || 0,
      buyer: incoming.buyer,
      brand: incoming.brand,
      image: imageUrl, // Store the URL
      // optional name and styleRows
      name: incoming.name,
      styleRows: incoming.styleRows
        ? parseIfJson(incoming.styleRows)
        : incoming.styleJson
        ? parseIfJson(incoming.styleJson)
        : undefined,
      cadRows: incoming.cadRows ?? {},
      fabricRows: incoming.fabricRows ?? {},
      trimsRows: incoming.trimsRows ?? {},
      othersRows: incoming.othersRows ?? {},
      summaryRows: incoming.summaryRows ?? {},
    };

    // If you want to update the style, update styleId instead
    if (incoming.style) {
      // Find style by name (normalize if needed)
      const normalizedStyle =
        typeof incoming.style === "string"
          ? incoming.style.replace(/[A-Za-z]+/g, (match) => match.toLowerCase())
          : incoming.style;
      const styleRecord = await prisma.style.findFirst({
        where: { name: normalizedStyle },
      });
      if (styleRecord) {
        updateData.styleId = styleRecord.id;
      }
      // If not found, you may want to create it, but usually style is not changed on update
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const costSheet = await prisma.costSheet.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(costSheet);
  } catch (error) {
    console.error("Update CostSheet Error:", error);
    console.error("Incoming Data:", req.body);
    res
      .status(500)
      .json({ error: "Failed to update cost sheet", details: error.message });
  }
};

export const deleteCostSheet = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.costSheet.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cost sheet" });
  }
};
