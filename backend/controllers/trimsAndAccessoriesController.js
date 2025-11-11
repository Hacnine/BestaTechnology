import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTrimsAndAccessories = async (req, res) => {
  try {
    const data = req.body;

    const newItem = await prisma.trimsAndAccessories.create({
      data: {
        ...data,
        createdBy: { connect: { id: req.user.id } },
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating trims and accessories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTrimsAndAccessories = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;  
    const updatedItem = await prisma.trimsAndAccessories.update({
      where: { id: Number(id) },
      data,
    });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating trims and accessories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allTrimsAndAccessories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    const items = await prisma.trimsAndAccessories.findMany({
      where: {
        name: {
          contains: search,
        //   mode: "insensitive",
        },
      },
      skip: offset,
      take: limit,
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching all trims and accessories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const trimsAndAccessoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.trimsAndAccessories.findUnique({
      where: { id: Number(id) },
    });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching trims and accessories by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
