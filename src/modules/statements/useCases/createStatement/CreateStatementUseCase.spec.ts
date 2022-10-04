import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Create a statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  });

  it("should be able to create a deposit", async () => {
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

    const statement = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description,
    });

    expect(statement).toBeInstanceOf(Statement);
    expect(statement.type).toBe(OperationType.DEPOSIT);
  });

  it("should be able to create a withdraw", async () => {
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

    await createStatementUseCase.execute({
      user_id: createdUser.id!,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description,
    });

    const withdraw = {
      user_id: createdUser.id,
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: "withdraw statement",
    }

    const result = await createStatementUseCase.execute({
      user_id: createdUser.id!,
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description,
    });

    expect(result).toBeInstanceOf(Statement);
    expect(result.type).toBe(OperationType.WITHDRAW);
  });

  it("should not be able to create a new statement for inexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "user statement"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw when user has insufficient funds", async () => {
    const user = {
      name: "Luella Freeman",
      email: "se@ogi.sk",
      password: "99828"
    }

    const createdUser = await createUserUseCase.execute(user);

    try {
      const withdraw = {
        user_id: createdUser.id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "deposit test"
      };

      const result = await createStatementUseCase.execute({
        user_id: createdUser.id!,
        type: withdraw.type,
        amount: withdraw.amount,
        description: withdraw.description,
      });

      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(CreateStatementError.InsufficientFunds);
    }
  });
});