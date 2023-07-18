import { mock } from 'jest-mock-extended'
import { User, UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { GetUserAccountUseCase } from './GetUserAccountUseCase'

// Initialize the GetUserUseCase with the mock UserRepository

describe('Unit test:GetUserAccountCase', () => {
  const mockUserRepo = mock<IUserRepository>()
  const getUserAccountUseCase = new GetUserAccountUseCase(mockUserRepo)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return user data when a valid id is provided', async () => {
    const mockUser = new User({
      id: '1',
      email: 'test@test.com',
      displayName: 'Test User',
      hashedPassword: 'hashedPassword',
      role: UserRoleType.PATIENT,
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    })

    const expected = {
      id: '1',
      email: 'test@test.com',
      displayName: 'Test User',
      role: UserRoleType.PATIENT,
      createdAt: new Date('2023-06-18T13:18:00.155Z'),
      updatedAt: new Date('2023-06-18T13:18:00.155Z'),
    }

    const response = await getUserAccountUseCase.execute({ user: mockUser })

    expect(response).toEqual(expected)
    expect(mockUserRepo.findById).toHaveBeenCalledWith('1')
  })

  it('should throw an error when a non-existent id is provided', async () => {
    // Create a request object for a non-existent user
    const mockRequest = {
      user: new User({
        id: '2',
        email: 'test@test.com',
        displayName: 'Test User',
        hashedPassword: 'hashedPassword',
        role: UserRoleType.PATIENT,
        createdAt: new Date('2023-06-18T13:18:00.155Z'),
        updatedAt: new Date('2023-06-18T13:18:00.155Z'),
      }),
    }

    mockUserRepo.findById.mockResolvedValue(null)

    await expect(getUserAccountUseCase.execute(mockRequest)).rejects.toThrow(
      'User not found'
    )
    expect(mockUserRepo.findById).toHaveBeenCalledWith('2')
  })
})
