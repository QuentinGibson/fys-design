import { prisma } from "~/db.server";
import { validateName } from "~/utils";

function isValidURL(url: string): boolean {
  const urlPattern = /^(http|https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

function isValidSlug(slug: string): boolean {
  // Define a regular expression pattern for valid slugs (lowercase letters, numbers, hyphens)
  const slugPattern = /^[a-z0-9-]+$/;

  // Use the test method to check if the input string matches the pattern
  return slugPattern.test(slug);
}

function isValidSummary(summary: string, maxLength: number = 200): boolean {
  // Check if the summary is a non-empty string
  if (typeof summary !== "string" || summary.trim().length === 0) {
    return false;
  }

  // Check if the summary length is within the specified limit
  if (summary.length > maxLength) {
    return false;
  }

  // If all checks pass, the summary is considered valid
  return true;
}

function isValidContent(html: string): boolean {
  // Define a regular expression pattern to match potentially harmful tags and attributes
  const disallowedTags = /<\s*(script|iframe|object|embed|style|link|meta|base|form|input|textarea|button|select|optgroup|option|label|fieldset|legend|iframe|frameset|frame|object|embed|applet|audio|video|source|track|track|a|area|map|svg|math|canvas|details|summary|bgsound|head|html|body|xml|vbscript|javascript|data):/gi;
  const disallowedAttributes = /(on\w+=|data-|style=|href=|src=)/i;

  // Check for potentially harmful tags and attributes
  if (disallowedTags.test(html) || disallowedAttributes.test(html)) {
    return false;
  }

  return true
}

function isValidImageFileName(fileName: string): boolean {
  // Define a list of allowed image file extensions (add more as needed)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

  // Get the file extension from the fileName
  const fileExtension = fileName.toLowerCase().slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

  // Check if the file extension is in the list of allowed extensions
  return allowedExtensions.includes(`.${fileExtension}`);
}

function isValidTags(tags: { label: string, value: string }[]): boolean {
  async function isValidTag(tag: { label: string, value: string }) {
    const res = await prisma.tag.findUnique({ where: { id: tag.value } })
    if (res === null) {
      return false
    }
    return true
  }
  tags.forEach(async (tag) => {
    const valid = await isValidTag(tag)
    if (!valid)
      return false
  })
  return true
}

export async function createCase(data: any) {
  let errors: InputError = {}
  const { name, slug, content, logo, image, tags } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }
  if (!isValidSlug(slug)) {
    errors.slug = "Invalid Slug. Please remove invalid characters!"
  }
  if (!isValidContent(content)) {
    errors.content = "Invalid Content. Please try again!"
  }

  if (logo) {
    if (!isValidImageFileName(logo)) {
      errors.logo = "Error, Please enter a valid image file."

    }
  }
  if (image) {
    if (!isValidImageFileName(image)) {
      errors.image = "Error, Please enter a valid image file."
    }
  }


  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }

  const caseData = await prisma.case.create({ data: data });
  return [null, caseData]
}

export async function getCaseByID(id: string) {
  try {
    const caseObj = await prisma.case.findUnique({ where: { id } });
    return { caseObj };
  } catch (error: any) {
    console.error("Error finding case. Message: " + error.message);
  }
}

export async function getCaseBySlug(slug: string) {
  const caseObj = await prisma.case.findUnique({ where: { slug }, include: { tags: true } });
  return caseObj;
}

export async function getCases() {
  const cases = await prisma.case.findMany({ include: { tags: true } });
  return cases
}

export async function updateCaseByID(id: string, data: any) {
  try {
    await prisma.case.update({ where: { id }, data });
  } catch (error: any) {
    console.error("Error updating case. Message: " + error.message);
  }
}

export async function updateCaseBySlug(inputSlug: string, data: any) {
  let errors: InputError = {}
  const { name, slug, content, logo, image, tags } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }
  if (!isValidSlug(slug)) {
    errors.slug = "Invalid Slug. Please remove invalid characters!"
  }
  if (!isValidContent(content)) {
    errors.content = "Invalid Content. Please try again!"
  }

  if (logo) {
    if (!isValidImageFileName(logo)) {
      errors.logo = "Error, Please enter a valid image file."

    }
  }
  if (image) {
    if (!isValidImageFileName(image)) {
      errors.image = "Error, Please enter a valid image file."
    }
  }


  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  const caseData = await prisma.case.update({ where: { slug: inputSlug }, data });
  return [null, caseData]
}

export async function deleteCaseById(id: string) {
  const oldcase = await prisma.case.delete({ where: { id } });
  return [null, oldcase];
}

export async function deleteCaseBySlug(slug: string) {
  const oldcase = await prisma.case.delete({ where: { slug } });
  return [null, oldcase];
}
