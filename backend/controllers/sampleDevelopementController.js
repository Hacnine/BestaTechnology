import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createSampleDevelopment = async (req, res) => {
  try {
    const {
      style,
      samplemanName,
      sampleReceiveDate,
      sampleCompleteDate,
      sampleQuantity,
    } = req.body;

    // Validate required fields
    if (
      !style ||
      !samplemanName ||
      !sampleReceiveDate ||
      !sampleCompleteDate ||
      sampleQuantity === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sampleDevelopment = await prisma.sampleDevelopment.create({
      data: {
        style,
        samplemanName,
        sampleReceiveDate: new Date(sampleReceiveDate),
        sampleCompleteDate: new Date(sampleCompleteDate),
        sampleQuantity: Number(sampleQuantity),
        createdBy: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json({
      message: 'Sample Development created successfully',
      data: sampleDevelopment,
    });
  } catch (error) {
    console.error('Error creating Sample Development:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};

// Get SampleDevelopment with pagination
export const getSampleDevelopment = async (req, res) => {
  try {
    const {
      ownSample,
      page = 1,
      pageSize = 10,
      search,
      startDate,
      endDate,
      actualCompleteDate,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    // Build where clause
    const where = {};

    // Filter by ownership: if ownSample=true, show only user's own Sample Developments
    if (ownSample === "true") {
      where.createdById = req.user && req.user.id ? req.user.id : undefined;
    }

    // Search by style or samplemanName (case-insensitive)
    if (search) {
      where.OR = [
        { tna: { style: { contains: search } } },
        { samplemanName: { contains: search } },
      ];
    }

    // Filter by sampleReceiveDate range
    if (startDate && endDate) {
      where.sampleReceiveDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.sampleReceiveDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.sampleReceiveDate = {
        lte: new Date(endDate),
      };
    }

    // Filter by actualSampleCompleteDate range (full day)
    if (actualCompleteDate) {
      const startOfDay = new Date(actualCompleteDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(actualCompleteDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.actualSampleCompleteDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Determine orderBy based on ownSample parameter
    let orderBy;
    if (ownSample === "true") {
      orderBy = { createdAt: "desc" };
    } else {
      orderBy = [{ updatedAt: "desc" }, { createdAt: "desc" }];
    }

    const [sampleDevelopments, total] = await Promise.all([
      prisma.sampleDevelopment.findMany({
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
      prisma.sampleDevelopment.count({ where }),
    ]);

    res.json({
      data: sampleDevelopments,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching Sample Developments:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Update SampleDevelopment by ID
export const updateSampleDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleDevId = parseInt(id, 10);
    const {
      samplemanName,
      sampleQuantity,
      
      finalCompleteDate,
      acceptance
    } = req.body;

    if (acceptance) {
      const updatedSample = await prisma.sampleDevelopment.update({
        where: { id: sampleDevId },
        data: {
          ...( { sampleReceiveDate: new Date() }),
          ...( {
            sampleCompleteDate: (() => {
              const date = new Date();
              date.setDate(date.getDate() + 2);
              return date;
            })(),
          }),
          ...(samplemanName !== undefined && { samplemanName }),
          ...(finalCompleteDate && {
            actualSampleCompleteDate: new Date(finalCompleteDate),
          }),
          ...(sampleQuantity !== undefined && { sampleQuantity }),
        },
      });

      res.json({ message: "Sample Development updated successfully", data: updatedSample });
    } else {
      const updatedSample = await prisma.sampleDevelopment.update({
        where: { id: sampleDevId },
        data: {
          actualSampleCompleteDate: new Date(),
          ...(samplemanName !== undefined && { samplemanName }),
        },
      });

      res.json({ message: "Sample Development updated successfully", data: updatedSample });
    }
  } catch (error) {
    console.error("Error updating Sample Development:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Delete SampleDevelopment by ID
export const deleteSampleDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleDevId = parseInt(id, 10);
    await prisma.sampleDevelopment.delete({
      where: { id: sampleDevId },
    });
    res.json({ message: 'Sample Development deleted successfully' });
  } catch (error) {
    console.error('Error deleting Sample Development:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};