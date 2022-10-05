import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });

  it("should be able to show a user profile", async () => {
    const user = {
      name: "Gordon Doyle",
      email: "turvoiva@dip.pl",
      password: "36020",
    };

    const createdUser = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(createdUser.id!);

    expect(profile).toHaveProperty("id");
  });

  it("should not be able to show profile of non existent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non existent user");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});