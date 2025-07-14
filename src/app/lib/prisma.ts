// Corrigindo o problema de importação do PrismaClient e garantindo que apenas uma instância seja criada (evita problemas em ambientes de hot-reload como Next.js)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;