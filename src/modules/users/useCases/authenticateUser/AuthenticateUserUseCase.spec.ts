import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "Jean Jefferson",
      email: "dahdudef@ur.gp",
      password: "36020",
    }

    await createUserUseCase.execute(user);

    const authenticateUser = await authenticateUserUseCase.execute({ email: user.email, password: user.password });

    expect(authenticateUser).toHaveProperty("token");
  });

  it("should not be able to authenticate a non-existent user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Gordon Doyle",
        email: "turvoiva@dip.pl",
        password: "36020",
      });

      await authenticateUserUseCase.execute({ email: user.email, password: user.password });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})