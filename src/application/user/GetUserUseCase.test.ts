import { mock } from 'jest-mock-extended'
import { User, UserRoleType } from '../../domain/user/User'
import { IUserRepository } from '../../domain/user/interfaces/repositories/IUserRepository'
import { GetUserUseCase } from './GetUserUseCase'

// Initialize the GetUserUseCase with the mock UserRepository

describe('Unit test: GetUserUseCase', () => {
  const mockUserRepo = mock<IUserRepository>()
  const getUserUseCase = new GetUserUseCase(mockUserRepo)

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
    const mockRequest = { id: '1' }

    mockUserRepo.findById.mockResolvedValue(mockUser)

    const response = await getUserUseCase.execute(mockRequest)

    expect(response).toEqual(expected)
    expect(mockUserRepo.findById).toHaveBeenCalledWith('1')
  })

  it('should throw an error when a non-existent id is provided', async () => {
    const mockRequest = { id: '2' }

    mockUserRepo.findById.mockResolvedValue(null)

    await expect(getUserUseCase.execute(mockRequest)).rejects.toThrow(
      'User not found'
    )
    expect(mockUserRepo.findById).toHaveBeenCalledWith('2')
  })
})
