import { mock } from 'jest-mock-extended'
import { User, UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { CreateUserUseCase } from './CreateUserUseCase'
import { IUuidService } from '../../domain/utils/IUuidService'
import { IHashGenerator } from '../../domain/utils/IHashGenerator'
import { ValidationError } from '../../infrastructure/error/ValidationError'

describe('Unit test: CreateUserUseCase', () => {
  const mockUserRepo = mock<IUserRepository>()
  const mockUuidService = mock<IUuidService>()
  const mockHashGenerator = mock<IHashGenerator>()

  const createUserUseCase = new CreateUserUseCase(
    mockUserRepo,
    mockUuidService,
    mockHashGenerator
  )

  const mockedDate = new Date('2023-06-18T13:18:00.155Z')
  jest.spyOn(global, 'Date').mockImplementation(() => mockedDate)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return a valid user data when displayName, email, password, and role are provided', async () => {
    const mockRequest = {
      displayName: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: UserRoleType.PATIENT,
    }

    const mockGeneratedUuid = 'generated-uuid'
    const mockHashedPassword = 'hashed-password'
    const mockSavedUser = new User({
      id: 'generated-uuid',
      email: 'test@test.com',
      displayName: 'Test User',
      hashedPassword: 'hashed-password',
      role: UserRoleType.PATIENT,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockUserRepo.findByEmail.mockResolvedValue(null)
    mockUuidService.generateUuid.mockReturnValue(mockGeneratedUuid)
    mockHashGenerator.hash.mockResolvedValue(mockHashedPassword)
    mockUserRepo.save.mockResolvedValue(Promise.resolve())
    const expectedResponse = {
      id: 'generated-uuid',
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
    }

    const response = await createUserUseCase.execute(mockRequest)

    expect(response).toEqual(expectedResponse)
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
    expect(mockHashGenerator.hash).toHaveBeenCalledWith('password123')
    expect(mockUserRepo.save).toHaveBeenCalledWith(mockSavedUser)
  })

  it('should throw an error when an existing email is provided', async () => {
    const mockRequest = {
      displayName: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: UserRoleType.PATIENT,
    }

    const mockExistingUser = new User({
      id: 'generated-uuid',
      email: 'test@test.com',
      displayName: 'Existing User',
      hashedPassword: 'hashed-password',
      role: UserRoleType.DOCTOR,
      createdAt: mockedDate,
      updatedAt: mockedDate,
    })

    mockUserRepo.findByEmail.mockResolvedValue(mockExistingUser)

    await expect(createUserUseCase.execute(mockRequest)).rejects.toThrow(
      ValidationError
    )
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
  })
})
