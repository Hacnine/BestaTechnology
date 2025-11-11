import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createFabricBooking = async (req, res) => {
  try {
    const { style, receiveDate, completeDate } = req.body;
    if (!style || !receiveDate || !completeDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const fabricBooking = await prisma.fabricBooking.create({
      data: {
        style,
        receiveDate: new Date(receiveDate),
        completeDate: new Date(completeDate),
        createdBy: { connect: { id: req.user.id } },
      },
    });
    res.status(201).json({
      message: "Fabric Booking created successfully",
      data: fabricBooking,
    });
  } catch (error) {
    console.error("Error creating Fabric Booking:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Add getFabricBooking with pagination
export const getFabricBooking = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search, startDate, endDate } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    // Build where clause for TNA (to get ids based on search)
    let tnaWhere = {};
    if (search) {
      tnaWhere.style = { contains: search };
    }

    // Get TNAs based on search (style)
    const tnas = await prisma.tNA.findMany({
      where: tnaWhere,
      select: { id: true },
    });
    const ids = tnas.map((tna) => tna.id);

    // Build where clause for FabricBooking
    const where = {
      // Only return fabric bookings for the matching TNAs
      tnaId: { in: ids },
    };

    // Filter by bookingDate range
    if (startDate && endDate) {
      where.bookingDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.bookingDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.bookingDate = {
        lte: new Date(endDate),
      };
    }

    const [fabricBookings, total] = await Promise.all([
      prisma.fabricBooking.findMany({
        skip,
        take,
        where,
        // use select to explicitly return scalar fields plus relations
        select: {
          id: true,
          receiveDate: true,
          completeDate: true,
          actualCompleteDate: true,
          tnaId: true,
          createdById: true,
          createdAt: true,
          tna: {
            select: {
              style: true,
              itemImage: true,
              merchandiser: {
                select: { userName: true },
              },
            },
          },
          createdBy: { select: { userName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.fabricBooking.count({ where }),
    ]);

    res.json({
      data: fabricBookings,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching Fabric Bookings:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Update FabricBooking by ID
export const updateFabricBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const fabricBookingId = parseInt(id, 10);
    const { isComplete, acceptance } = req.body;
    const completeDate = new Date(); completeDate.setDate(completeDate.getDate()+15);
    
    if (acceptance) {
      const updated = await prisma.fabricBooking.update({
        where: { id: fabricBookingId },
        data: {
          receiveDate: new Date(),
          completeDate: completeDate,
          createdBy: { connect: { id: req.user.id } },
        },
      });
      return res.json({
        message: "Fabric Booking updated successfully",
        data: updated,
      });
    } else {
      const updatedFabricData = await prisma.fabricBooking.update({
        where: { id: fabricBookingId },
        data: {
          actualCompleteDate: isComplete ? new Date() : null,
        },
      });
      return res.json({
        message: "Fabric Booking updated successfully",
        data: updatedFabricData,
      });
    }
  } catch (error) {
    console.error("Error updating Fabric Booking:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Delete FabricBooking by ID
export const deleteFabricBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const fabricBookingId = parseInt(id, 10);
    await prisma.fabricBooking.delete({
      where: { id: fabricBookingId },
    });
    res.json({ message: "Fabric Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting Fabric Booking:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
