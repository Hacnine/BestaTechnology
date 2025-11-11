import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCadApproval = async (req, res) => {
  try {
    const { style, fileReceiveDate, completeDate, cadMasterName } = req.body;

    if (!style || !fileReceiveDate || !completeDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const cadApproval = await prisma.cadDesign.create({
      data: {
        style,
        fileReceiveDate: new Date(fileReceiveDate),
        completeDate: new Date(completeDate),
        CadMasterName: cadMasterName || null,
        createdBy: { connect: { id: req.user.id } },
      },
    });
    res
      .status(201)
      .json({
        message: "CAD Approval created successfully",
        data: cadApproval,
      });
  } catch (error) {
    console.error("Error creating CAD Approval:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getCadApproval = async (req, res) => {
  try {
    const {
      ownCad,
      page = 1,
      pageSize = 10,
      search,
      startDate,
      endDate,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    // Build where clause
    const where = {};

    // Filter by ownership: if ownCad=true, show only user's own CAD designs
    // if ownCad=false or not provided, show all CAD designs
    if (ownCad === "true") {
      where.createdById = req.user && req.user.id ? req.user.id : undefined;
    }

    // Search by style or CadMasterName (case-insensitive)
    if (search) {
      where.OR = [
        { style: { contains: search } },
        { CadMasterName: { contains: search } },
      ];
    }

    // Filter by fileReceiveDate range
    if (startDate && endDate) {
      where.fileReceiveDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.fileReceiveDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.fileReceiveDate = {
        lte: new Date(endDate),
      };
    }

    // Determine orderBy based on ownCad parameter
    let orderBy;
    if (ownCad === "true") {
      orderBy = { createdAt: "desc" };
    } else {
      orderBy = [{ updatedAt: "desc" }, { createdAt: "desc" }];
    }

    const [cadApprovals, total] = await Promise.all([
      prisma.cadDesign.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          tna: {
            select: {
              style: true,
              itemImage: true,
              merchandiser: {
                select: { userName: true },
              },
            },
          },
        },
      }),
      prisma.cadDesign.count({ where }),
    ]);

    res.json({
      data: cadApprovals,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching CAD Approvals:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const updateCadDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const CadMasterName = req.user.userName;
    // Convert id to integer
    const cadId = parseInt(id, 10);
    const {
      finalFileReceivedDate,
      finalCompleteDate,
      acceptance
    } = req.body;

    if (acceptance) {
      const updatedCad = await prisma.cadDesign.update({
        where: { id: cadId },
        data: {
          ...( { fileReceiveDate: new Date() }),
          ...( {
            completeDate: (() => {
              const date = new Date();
              date.setDate(date.getDate() + 2);
              return date;
            })(),
          }),
          ...(CadMasterName !== undefined && { CadMasterName }),
          ...(finalCompleteDate && {
            finalCompleteDate: new Date(finalCompleteDate),
          }),
        },
      });

      res.json({ message: "CAD Design updated successfully", data: updatedCad });
    } else {
      const updatedCad = await prisma.cadDesign.update({
        where: { id: cadId },
        data: {
          finalCompleteDate: new Date(),
          ...(CadMasterName !== undefined && { CadMasterName }),
        },
      });

      res.json({ message: "CAD Design updated successfully", data: updatedCad });
    }
  } catch (error) {
    console.error("Error updating CAD Design:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const deleteCadDesign = async (req, res) => {
  try {
    const { id } = req.params;
    // Convert id to integer
    const cadId = parseInt(id, 10);
    await prisma.cadDesign.delete({
      where: { id: cadId },
    });
    res.json({ message: "CAD Design deleted successfully" });
  } catch (error) {
    console.error("Error deleting CAD Design:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
