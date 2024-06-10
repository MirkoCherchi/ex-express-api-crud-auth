const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bodyData = {
  title: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title è un campo obbligatorio.",
      bail: true,
    },
    isString: {
      errorMessage: "Title deve essere una stringa.",
      bail: true,
    },
    isLength: {
      errorMessage: "Title deve essere di almeno 3 caratteri",
      options: { min: 3 },
    },
  },

  content: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Content è un campo obbligatorio.",
      bail: true,
    },
    isString: {
      errorMessage: "Content deve essere una stringa.",
      bail: true,
    },
  },
  published: {
    in: ["body"],
    isBoolean: {
      errorMessage: "Published deve essere un booleano.",
    },
  },
  img: {
    in: ["body"],
    optional: {
      options: { nullable: true },
    },
    isString: {
      errorMessage: "img deve essere una stringa.",
      bail: true,
    },
    matches: {
      options: [/.(jpg|jpeg|png|gif)$/i],
      errorMessage: "img deve avere un estenzione valida (jpg, jpeg, png, gif)", // Correzione qui
    },
  },

  categoryId: {
    in: ["body"],
    isInt: {
      errorMessage: "Category Id deve essere numero intero",
      bail: true,
    },
    custom: {
      options: async (value) => {
        const categoryId = parseInt(value);
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          throw new Error(`Non esiste una Category con id ${categoryId}`);
        }
        return true;
      },
    },
  },
  tags: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Tags è un campo obbligatorio.",
      bail: true,
    },
    isArray: {
      errorMessage: "Tags deve essere un array",
      bail: true,
    },
    custom: {
      options: async (ids) => {
        if (ids.length === 0) {
          throw new Error(`Una Post deve avere almeno un tags`);
        }
        const notIntegerId = ids.find((id) => isNaN(parseInt(id)));
        if (notIntegerId) {
          throw new Error(`Uno o più ID non sono dei numeri interi.`);
        }
        const tags = await prisma.ingredient.findMany({
          where: { id: { in: ids } },
        });
        if (tags.length !== ids.length) {
          throw new Error(`Uno o più tags specificati non esistono.`);
        }
        return true;
      },
    },
  },
};

module.exports = {
  bodyData,
};
