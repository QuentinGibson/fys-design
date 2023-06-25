import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "qdogg@email.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("frontend", 10);

  await prisma.user.create({
    data: {
      email,
      role: "ADMIN",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.service.create({
    data: {
      name: "Website Design & Development",
      image: "/uploads/services/webdesign-example.png",
      perks: {
        create: [
          { name: "Custom Design" },
          { name: "Custom Development" },
          { name: "Theme Customization" },
          { name: "App Implementation" },
          { name: "Landing Page" },
          { name: "Conversion Rate Option" },
        ],
      },
      description:
        "Our expertise as certified Shopify professionals enables us to create cutting-edge websites with a strong focus on conversion. Whether you prefer to work with pre-existing Shopify themes or require a fully customized solution, our team can deliver.",
    },
  });

  await prisma.service.create({
    data: {
      name: "Digital Marketing",
      image: "/uploads/services/marketing-example.jpg",
      perks: {
        create: [
          { name: "Email Marketing" },
          { name: "A/B Page Testing" },
          { name: "SMS Marketing" },
          { name: "Customer Acquisition" },
          { name: "Google Advertising" },
          { name: "FB / IG Advertising" },
        ],
      },
      description:
        "Drawing from our experience as brand owners, we have devised a distinctive formula for content development and digital marketing. Our team has collaborated with brands from a wide range of industries to create and implement comprehensive, integrated, and successful marketing strategies.",
    },
  });

  await prisma.service.create({
    data: {
      name: "Systems and Apps",
      image: "/uploads/services/system-example.jpg",
      perks: {
        create: [
          { name: "Customer Reviews" },
          { name: "Customer Service" },
          { name: "Loyalty Programs" },
          { name: "Subscriptions" },
          { name: "Retailer Compliance" },
          { name: "Integrations" },
          { name: "GS1 Barcode UPC / EAN Management" },
        ],
      },
      description:
        "Are you experiencing growing pains and require assistance? Perhaps you're just starting and need help finding suitable software solutions? Our team can aid you in streamlining your operations by consolidating your processes, inventory, order workflows, stock locations, and sales channels.",
    },
  });

  const foodAndBeverageIndustry = await prisma.industry.upsert({
    where: { name: "Food and Beverage" },
    update: {},
    create: { name: "Food and Beverage" },
  });

  const homeGoodsIndustry = await prisma.industry.upsert({
    where: { name: "Home Goods" },
    update: {},
    create: { name: "Home Goods" },
  });

  const eCommerceIndustry = await prisma.industry.upsert({
    where: { name: "eCommerce" },
    update: {},
    create: { name: "eCommerce" },
  });

  const fashionIndustry = await prisma.industry.upsert({
    where: { name: "Fashion" },
    update: {},
    create: { name: "Fashion" },
  });

  const customWebsiteService = await prisma.type.upsert({
    where: { name: "Custom Website" },
    update: {},
    create: { name: "Custom Website" },
  });

  const developmentService = await prisma.type.upsert({
    where: { name: "Development" },
    update: {},
    create: { name: "Development" },
  });

  const subscriptionsService = await prisma.type.upsert({
    where: { name: "Subscriptions" },
    update: {},
    create: { name: "Subscriptions" },
  });

  const brandingService = await prisma.type.upsert({
    where: { name: "Branding" },
    update: {},
    create: { name: "Branding" },
  });

  const photographyService = await prisma.type.upsert({
    where: { name: "Photography" },
    update: {},
    create: { name: "Photography" },
  });

  const customWebsiteDesignService = await prisma.type.upsert({
    where: { name: "Custom Website Design & Development" },
    update: {},
    create: { name: "Custom Website Design & Development" },
  });

  const shopifyPlusService = await prisma.type.upsert({
    where: { name: "Shopify Plus" },
    update: {},
    create: { name: "Shopify Plus" },
  });

  const buildABoxService = await prisma.type.upsert({
    where: { name: "Build-a-Box" },
    update: {},
    create: { name: "Build-a-Box" },
  });

  const klaviyoService = await prisma.type.upsert({
    where: { name: "Klaviyo" },
    update: {},
    create: { name: "Klaviyo" },
  });

  const growthTag = await prisma.tag.upsert({
    where: { name: "Growth" },
    update: {},
    create: { name: "Growth" },
  });

  await prisma.project.create({
    data: {
      name: "Greats of Craft",
      image: "/uploads/projects/greats-of-craft.jpeg",
      industries: {
        connect: [
          { id: foodAndBeverageIndustry.id },
          { id: eCommerceIndustry.id },
        ],
      },
      services: {
        connect: [
          { id: customWebsiteService.id },
          { id: developmentService.id },
          { id: subscriptionsService.id },
          { id: buildABoxService.id },
          { id: klaviyoService.id },
        ],
      },
      summary: "Creating a highly",
      content: "",
    },
  });

  await prisma.project.create({
    data: {
      name: "Mariani Premium Dried Fruit",
      image: "/uploads/projects/mariani.png",
      industries: {
        connect: [
          { id: eCommerceIndustry.id },
          { id: foodAndBeverageIndustry.id },
        ],
      },
      services: {
        connect: [
          { id: customWebsiteDesignService.id },
          { id: shopifyPlusService.id },
        ],
      },
      link: "http://mariani.com",
      summary: "Giving a new image to a classic heritage brand.",
      content: "",
    },
  });

  await prisma.project.create({
    data: {
      name: "Grace Rose Farm",
      image: "/uploads/projects/grace-rose-farm.jpeg",
      industries: {
        connect: [{ id: eCommerceIndustry.id }, { id: homeGoodsIndustry.id }],
      },
      services: {
        connect: [
          { id: customWebsiteDesignService.id },
          { id: shopifyPlusService.id },
        ],
      },
      link: "http://gracerosefarm.com",
      summary:
        "Building a conversion focused experience as beautiful as the farm.",
      content: "",
    },
  });

  await prisma.project.create({
    data: {
      name: "Surely Non-Alchoholic Wine",
      image: "/uploads/projects/surely.jpeg",
      industries: {
        connect: [
          { id: eCommerceIndustry.id },
          { id: foodAndBeverageIndustry.id },
        ],
      },
      services: {
        connect: [
          { id: customWebsiteDesignService.id },
          { id: shopifyPlusService.id },
        ],
      },
      link: "http://drinksurely.com",
      summary:
        "Balancing a brand-driven experience with unique solutions to drive conversion and customer loyalty",
      content: "",
    },
  });

  await prisma.project.create({
    data: {
      name: "FRESHY World",
      image: "/uploads/projects/fresh-world.jpeg",
      industries: {
        connect: [{ id: eCommerceIndustry.id }, { id: fashionIndustry.id }],
      },
      services: {
        connect: [
          { id: customWebsiteDesignService.id },
          { id: developmentService.id },
          { id: brandingService.id },
          { id: photographyService.id },
        ],
      },
      link: "http://freshyworld.com",
      summary: "Building a fun and lively brand from the ground up!",
      content: "",
    },
  });

  await prisma.case.create({
    data: {
      name: "Sweet E’s Bake Shop Reaches Record Conversion Rates Following Website Redesign from Pacific IQ",
      image: "/uploads/cases/sweet-e.png",
      logo: "/uploads/cases/logos/sweet-e-logo.png",
      tag: { connect: [{ id: growthTag.id }] },
      content: "",
    },
  });

  await prisma.case.create({
    data: {
      name: "Furbish Studio partnered with Pacific IQ to improve its website conversion rate by 2.5x, resulting in 49% more sales.",
      image: "/uploads/cases/furbish.png",
      logo: "/uploads/cases/furbish-logo.png",
      tag: { connect: [{ id: growthTag.id }] },
      content: "",
    },
  });

  await prisma.testimonial.create({
    data: {
      name: "Flamingo Estate",
      content:
        "Pacific IQ has led a web refresh for our brand, Flamingo Estate, to create a visually interactive e-comm site providing great UX for visitors and easy maintenance on the back end for our team.We had regular check-ins to address any site issues and updates regarding progress. Sean and team held our hand every step of the way, from facilitated meetings with their extensive list of Shopify app contacts (Okendo, Stripe, Routific, ReCharge) to recommending the latest technologies and providing case study feedback on best practices for ecomm.  Overall, the scope was large with an aspirational timeline for development and Sean did not disappoint by keeping us on track and staying within the constraints of our budget.",
    },
  });

  await prisma.testimonial.create({
    data: {
      name: "Mariani Dried Fruit",
      content:
        "Our time working with the team at Pacific IQ on a site design and development project was one of our best agency experiences. Cross- agency cooperation isn’t necessarily the norm in our experience and it was really fulfilling to work together with such a great partner. Sean and Bess are great communicators around scope and planning of a design and development project. There are no surprises and roles and responsibilities are clear. They have a very organized and methodical approach to project planning and managing expectations. Pacific IQ design work was really beautiful and executed the brand vision perfectly, while balancing the need to also have a high converting store site in addition to the brand content. The finished site was clean and modern, easy to navigate, and had well designed product pages intended for easy conversion. The project we worked on with Pacific IQ had a very tight timeline and Sean and Bess managed the timeline without even breaking a sweat. They worked through every curveball with ease and the project was delivered on time and ultimately exceeded expectations.As a co-agency serving the same client, we wish all of our experiences with other agencies were as smooth and professional as the time we spent with the Pacific IQ team. They were completely focused on their client’s satisfaction and were amazing partners to work with. Sean and Bess truly take their clients wants and needs to heart and put their everything into delivering the best possible customer experience on a brand and store site. We definitely hope to partner more with the Pacific IQ team in the future.",
    },
  });

  await prisma.testimonial.create({
    data: {
      name: "Healthy Bud",
      content:
        "Sean & Bess have exceeded expectations in many ways! We're thrilled with how our new Shopify website turned out. From the very onset of the relationship (even before any work started or any payment was made) PacificIQ was making suggestions for copywriters, designers, photographers and more... They have an amazing network and many resources that they were kind enough to share.Once we got to work, they were very communicative throughout the whole process and took all our suggestions into account. We found their willingness to collaborate was very genuine and we really appreciated being kept in the loop throughout every stage of the process.The end result says it all! We are in love with our website and, more importantly, our customers are too!Thank you Sean & Bess. We will certainly be recommending you to anyone in our network who is looking for web development help!",
    },
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
