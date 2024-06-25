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
    trim: true,
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
    toBoolean: true,
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
      errorMessage: "img deve avere un'estensione valida (jpg, jpeg, png, gif)",
    },
  },

  categoryId: {
    in: ["body"],
    customSanitizer: {
      options: (value) => {
        if (typeof value === "string") {
          const parsedValue = parseInt(value, 10);
          return isNaN(parsedValue) ? null : parsedValue;
        }
        return value;
      },
    },
    isInt: {
      errorMessage: "Category Id deve essere numero intero",
      bail: true,
    },
    custom: {
      options: async (value) => {
        if (value === null || value === undefined) {
          throw new Error("Category Id deve essere numero intero");
        }
        const categoryId = parseInt(value, 10);
        if (isNaN(categoryId)) {
          throw new Error("Category Id deve essere numero intero");
        }
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
    customSanitizer: {
      options: (value) => {
        if (typeof value === "string") {
          return value.split(",").map((id) => parseInt(id.trim(), 10));
        }
        return value.map((id) => parseInt(id, 10));
      },
    },
    isArray: {
      errorMessage: "Tags deve essere un array",
      bail: true,
    },
    custom: {
      options: async (ids) => {
        if (!Array.isArray(ids)) {
          throw new Error("Tags deve essere un array");
        }
        if (ids.length === 0) {
          throw new Error("Una Post deve avere almeno un tag.");
        }
        const notIntegerId = ids.find((id) => isNaN(id));
        if (notIntegerId) {
          throw new Error("Uno o più ID non sono dei numeri interi.");
        }
        const tags = await prisma.tag.findMany({
          where: { id: { in: ids } },
        });
        if (tags.length !== ids.length) {
          throw new Error("Uno o più tags specificati non esistono.");
        }
        return true;
      },
    },
  },
};

module.exports = {
  bodyData,
};
