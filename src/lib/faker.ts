import { fakerVI } from "@faker-js/faker";

export const faker = fakerVI;

export function seedFaker(seed = 42) {
  faker.seed(seed);
}
