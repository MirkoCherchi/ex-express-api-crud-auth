const { PrismaClient } = require("@prisma/client");
const errorHandler = require("../middlewares/errorHandler.js");
const prisma = new PrismaClient();

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

const store = async (req, res) => {
  const { title, content, categoryId, tags, img } = req.body;
  const slug = generateSlug(title);
  if (categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).send("Categoria non valida.");
    }
  }

  const data = {
    title,
    slug,
    content,
    img,
    published: req.body.published ? true : false,
    tags: {
      connect: tags.map((id) => ({ id })),
    },
  };

  if (categoryId) {
    data.categoryId = categoryId;
  }

  try {
    const post = await prisma.post.create({
      data,
      include: {
        tags: true,
      },
    });
    res.status(200).send(post);
  } catch (error) {
    console.error("Qualcosa è andato storto", error);
    res.status(500).send("Errore durante la creazione del post");
  }
};

const index = async (req, res) => {
  try {
    const { published, search } = req.query;
    const where = {};

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const { page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    const totalItems = await prisma.post.count({ where });

    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      throw new Error("La pagina richiesta non esiste.");
    }

    const posts = await prisma.post.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        _count: {
          select: {
            tags: true,
          },
        },
        tags: true,
        category: true,
      },
    });

    res.json({
      data: posts.map((p) => ({
        ...p,
        totalTags: p._count.tags,
        _count: undefined,
      })),
      page: parseInt(page),
      totalItems,
      totalPages,
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const show = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        tags: true,
      },
    });
    if (post) {
      res.json(post);
    } else {
      res.status(404).send(`Post con lo slug ${slug} non trovato.`);
    }
  } catch (err) {
    console.error("Qualcosa è andato storto", err);
    res.status(500).send("Errore durante il recupero del post");
  }
};

const update = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, categoryId, tags } = req.body;
    const data = {
      title,
      content,
      published: req.body.available ? true : false,
      tags: {
        set: published.map((id) => ({ id })),
      },
    };
    if (categoryId) {
      data.categoryId = categoryId;
    }

    if (postData.title) {
      const newSlug = generateSlug(postData.title);
      postData.slug = newSlug;
    }
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: postData,
    });

    res.json(updatedPost);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

const destroy = async (req, res) => {
  try {
    const { slug } = req.params;
    await prisma.post.delete({
      where: { slug },
    });
    res.json(`Post con slug ${slug} eliminato con successo.`);
  } catch (err) {
    errorHandler(err, req, res);
  }
};

module.exports = { store, index, show, update, destroy };
