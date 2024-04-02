export interface IUSer {
  id: string
  session_id: string
  name: string
  email: string
  created_at: string
  update_at: string
}

export const users: IUSer[] = [
  {
    id: 'a107944b-36b8-4a37-8e5d-864fea5dcc2b',
    session_id: '3f984f7b-47aa-4377-98e1-97797423dd19',
    name: 'felcam',
    email: 'felcam@gmail.com',
    created_at: '123123123',
    update_at: '123123123',
  },
  {
    id: '8b6f5e6f-e3d5-4fa3-a5ff-5bb76ebd2108',
    session_id: 'e5dcb5dc-2022-4b75-b4f4-12257760bee5',
    name: 'fernando',
    email: 'fernando@gmail.com',
    created_at: '123123123',
    update_at: '123123123',
  },
]

export const meals = [{}]
