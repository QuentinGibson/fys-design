import { prisma } from "~/db.server";

export async function createTag(data: any) {
  try {
    const tag = await prisma.tag.create(data);
    return { tag };
  } catch (error: any) {
    console.error("Error creating tag. Message: " + error.message);
  }
}

export async function getTagByID(id: string) {
  try {
    const tag = await prisma.tag.findUnique({ where: { id } });
    return { tag };
  } catch (error: any) {
    console.error("Error finding tag. Message: " + error.message);
  }
}

export async function getTags() {
  try {
    const tags = prisma.tag.findMany();
    return { tags };
  } catch (error: any) {
    console.error("Error finding all tags. Message: " + error.message);
  }
}

export async function updateTagByID(id: string, data: any) {
  try {
    const tag = prisma.tag.update({ where: { id }, data });
    return { tag };
  } catch (error: any) {
    console.error("Error updating tag. Message: " + error.message);
  }
}

export async function deleteTagByID(id: string) {
  try {
    const tag = prisma.tag.delete({ where: { id } });
    return { tag };
  } catch (error: any) {
    console.error("Error deleting tag. Message: " + error.message);
  }
}
