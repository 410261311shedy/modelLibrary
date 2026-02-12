// lib/prisma.ts
import 'dotenv/config';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };