import { prisma } from "~/db.server";

export async function createPerk(data: any) {
  try {
    const perk = await prisma.perk.create(data);
    return { perk };
  } catch (error: any) {
    console.error("Error creating perk. Message: " + error.message);
  }
}

export async function getPerkByID(id: string) {
  try {
    const perk = await prisma.perk.findUnique({ where: { id } });
    return { perk };
  } catch (error: any) {
    console.error("Error finding perk. Message: " + error.message);
  }
}

export async function getPerks() {
  const perks = await prisma.perk.findMany();
  return perks;
}

export async function updatePerkByID(id: string, data: any) {
  try {
    const perk = await prisma.perk.update({ where: { id }, data });
    return { perk };
  } catch (error: any) {
    console.error("Error updating perk. Message: " + error.message);
  }
}

export async function deletePerkByID(id: string) {
  try {
    const perk = await prisma.perk.delete({ where: { id } });
    return { perk };
  } catch (error: any) {
    console.error("Error deleting perk. Message: " + error.message);
  }
}
