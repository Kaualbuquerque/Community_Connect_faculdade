// tests updated: src/modules/notes/tests/notes.controller.int.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { NotesController } from "../notes.controller";
import { NoteService } from "../notes.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { Note } from "../note.entity";
import { User } from "src/modules/users/user.entity";

describe("NoteController (integração simulada)", () => {
    let app: INestApplication;
    let mockNoteService: jest.Mocked<NoteService>;

    const mockUser: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        phone: "123456789",
        role: "consumer",
        cep: "12345678",
        state: "SP",
        city: "São Paulo",
        number: "123",
        createdAt: new Date(),
        services: [],
        favorites: [],
        notes: [],
        history: [],
        messages: [],
        conversations: [],
    };

    beforeAll(async () => {
        mockNoteService = {
            create: jest.fn(),
            findNotesByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as any;

        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [NotesController],
            providers: [{ provide: NoteService, useValue: mockNoteService }],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (ctx) => {
                    const req = ctx.switchToHttp().getRequest();
                    req.user = mockUser;
                    return true;
                },
            })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterEach(() => jest.clearAllMocks());

    afterAll(async () => {
        await app.close();
    });

    it("cria nota", async () => {
        const dto = { content: "Minha primeira nota" };

        const fakeNote: Note = {
            id: 1,
            content: dto.content,
            createdAt: new Date(),
            user: mockUser,
        };

        mockNoteService.create.mockResolvedValue(fakeNote);

        const response = await request(app.getHttpServer())
            .post("/notes")
            .send(dto)
            .expect(201);

        expect(response.body).toEqual({
            id: 1,
            content: dto.content,
            createdAt: fakeNote.createdAt.toISOString(),
            user: {
                ...mockUser,
                createdAt: mockUser.createdAt.toISOString(),
            },
        });

        expect(mockNoteService.create).toHaveBeenCalledWith(dto, mockUser);
    });

    it("retorna notas do usuário", async () => {
        const fakeNotes = [
            { id: 1, content: "Nota 1", createdAt: new Date(), user: mockUser },
            { id: 2, content: "Nota 2", createdAt: new Date(), user: mockUser },
        ];

        mockNoteService.findNotesByUser.mockResolvedValue(fakeNotes);

        const response = await request(app.getHttpServer())
            .get("/notes")
            .expect(200);

        expect(response.body).toEqual(
            fakeNotes.map((n) => ({
                ...n,
                createdAt: n.createdAt.toISOString(),
                user: {
                    ...n.user,
                    createdAt: n.user.createdAt.toISOString(),
                },
            })),
        );

        expect(mockNoteService.findNotesByUser).toHaveBeenCalledWith(mockUser);
    });

    it("retorna nota específica", async () => {
        const fakeNote = {
            id: 1,
            content: "Nota específica",
            createdAt: new Date(),
            user: mockUser,
        };

        mockNoteService.findOne.mockResolvedValue(fakeNote);

        const response = await request(app.getHttpServer())
            .get("/notes/1")
            .expect(200);

        expect(response.body).toEqual({
            ...fakeNote,
            createdAt: fakeNote.createdAt.toISOString(),
            user: {
                ...mockUser,
                createdAt: mockUser.createdAt.toISOString(),
            },
        });

        expect(mockNoteService.findOne).toHaveBeenCalledWith(1);
    });

    it("atualiza nota", async () => {
        const dto = { content: "Nota atualizada" };

        const updatedNote = {
            id: 1,
            content: dto.content,
            createdAt: new Date(),
            user: mockUser,
        };

        mockNoteService.update.mockResolvedValue(updatedNote);

        const response = await request(app.getHttpServer())
            .put("/notes/1")
            .send(dto)
            .expect(200);

        expect(response.body).toEqual({
            ...updatedNote,
            createdAt: updatedNote.createdAt.toISOString(),
            user: {
                ...mockUser,
                createdAt: mockUser.createdAt.toISOString(),
            },
        });

        expect(mockNoteService.update).toHaveBeenCalledWith(1, dto);
    });

    it("remove nota", async () => {
        mockNoteService.remove.mockResolvedValue(undefined);

        await request(app.getHttpServer())
            .delete("/notes/1")
            .expect(200);

        expect(mockNoteService.remove).toHaveBeenCalledWith(1);
    });
});
