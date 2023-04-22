export interface IBaseRepository<DM> {
  save: (entity: DM) => Promise<void>
}
