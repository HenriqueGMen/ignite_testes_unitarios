import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory);
  })

  it("should be able to get user statement operation", async () => {
    const user = {
      name: "Gordon Doyle",
      email: "turvoiva@dip.pl",
      password: "36020"
    }

    const createdUser = await createUserUseCase.execute(user);

    const deposit = {
      user_id: createdUser.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "deposit statement",
    }

    const createStatement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id!,
      statement_id: createStatement.id!
    });

    expect(statement).toBeInstanceOf(Statement);
    expect(statement).toHaveProperty('id');
    expect(statement.type).toBe(OperationType.DEPOSIT);
  });

  it("should not be able to get a statement operation for an inexistent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user statement",
        statement_id: "id statement",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get an inexistent statement operation", () => {
    expect(async () => {
      const user = {
        name: "Gordon Doyle",
        email: "turvoiva@dip.pl",
        password: "36020"
      }

      const createdUser = await createUserUseCase.execute(user);
      const statement = await getStatementOperationUseCase.execute({ user_id: createdUser.id!, statement_id: "id statement" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});