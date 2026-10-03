import "server-only";
import { faker } from "@faker-js/faker";

export const MOCK_SEED = 20260926;

faker.seed(MOCK_SEED);

export { faker };
