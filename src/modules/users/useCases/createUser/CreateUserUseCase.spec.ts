import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Gordon Doyle",
      email: "turvoiva@dip.pl",
      password: "36020",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a existent user", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "first user",
        email: "user@test.com",
        password: "36020",
      });

      await createUserUseCase.execute({
        name: "second user",
        email: "user@test.com",
        password: "36020",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});