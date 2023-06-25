import { prisma } from "~/db.server";

export async function createProject(data: any) {
  try {
    const project = await prisma.project.create(data);
    return { project };
  } catch (error: any) {
    console.error("Error creating project. Message: " + error.message);
  }
}

export async function getProjectByID(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return { project };
  } catch (error: any) {
    console.error("Error fetching project. Message: " + error.message);
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany();
    return { projects };
  } catch (error: any) {
    console.error("Error fetching all projects. Message: " + error.message);
  }
}

export async function updateProjectByID(id: string, data: any) {
  try {
    const project = await prisma.project.update({ where: { id }, data });
    return { project };
  } catch (error: any) {
    console.error("Error updating project. Message: " + error.message);
  }
}

export async function deleteProjectByID(id: string) {
  try {
    const project = await prisma.project.delete({ where: { id } });
    return { project };
  } catch (error: any) {
    console.error("Error deleting project. Message: " + error.message);
  }
}
