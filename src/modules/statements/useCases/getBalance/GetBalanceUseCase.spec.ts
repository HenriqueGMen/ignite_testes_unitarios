import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, userRepositoryInMemory);
  });

  it("should be able to get the user account balance", async () => {
    const user = {
      name: "Gordon Doyle",
      email: "turvoiva@dip.pl",
      password: "36020"
    }

    const createdUser = await createUserUseCase.execute(user);

    const getUserBalance = await getBalanceUseCase.execute({ user_id: createdUser.id! });

    expect(getUserBalance).toHaveProperty("statement");
    expect(getUserBalance).toHaveProperty("balance");
  });

  it("Should not be able to get a non existent user balance", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "user balance" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});