import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const updateDHLTracking = async (req, res) => {
  try { 
    const { tnaId, date, trackingNumber, isComplete } = req.body;
console.log(tnaId)
    if (!tnaId || !date || !trackingNumber) {
      return res.status(400).json({ error: "tnaId, date and trackingNumber are required" });
    }

    // Prisma `upsert` requires the `where` clause to reference a UNIQUE field
    // (for example `id`). `tnaId` is not unique in the schema, so calling
    // `upsert({ where: { tnaId }})` causes a PrismaClientValidationError.
    //
    // Fix: find any existing record for the given tnaId and then perform an
    // update by `id` if present, otherwise create a new record.
    const existing = await prisma.dHLTracking.findFirst({ where: { tnaId } });

    let dhlTracking;
    if (existing) {
      dhlTracking = await prisma.dHLTracking.update({
        where: { id: existing.id },
        data: {
          date: new Date(date),
          trackingNumber,
          isComplete: isComplete ?? false,
        },
      });
    } else {
      dhlTracking = await prisma.dHLTracking.create({
        data: {
          tnaId,
          date: new Date(date),
          trackingNumber,
          isComplete: isComplete ?? false,
        },
      });
    }

    res.status(200).json({
      message: "DHL Tracking updated successfully",
      data: dhlTracking,
    });
  } catch (error) {
    console.error("Error updating DHL Tracking:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
