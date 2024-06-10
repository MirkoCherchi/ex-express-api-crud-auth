const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const recBody = {
  email: {
    in: ["body"],
    notEmpty: {
      erorMessage: "Inserire l'email",
      bail: true,
    },
    isEmail: {
      erroreMessage: "L'email deve essere valida",
      bail: true,
    },
    custom: {
      options: async (value) => {
        const user = await prisma.user.findUnique({
          where: { email: value },
        });
        if (user) {
          throw new Error("Email già registrata");
        }
        return true;
      },
    },
  },
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name deve essere una stringa.",
      bail: true,
    },
    isLength: {
      erroreMessage: "Name deve essere di almeno 2 caratteri",
      options: { min: 3 },
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password è un campo obbligatorio.",
      bail: true,
    },
    isString: {
      errorMessage: "Password deve essere una stringa.",
      bail: true,
    },
    isLength: {
      errorMessage: "Password deve essere di almeno 6 caratteri",
      options: { min: 6 },
    },
  },
};

const loginBody = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email è un campo obbligatorio.",
      bail: true,
    },
    isEmail: {
      errorMessage: "Email deve essere una mail valida",
    },
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password è un campo obbligatorio.",
      bail: true,
    },
    isString: {
      errorMessage: "Password deve essere una stringa.",
    },
  },
};

module.exports = {
  recBody,
  loginBody,
};
