export declare class PersonController {
    getPeople(): Promise<{
        message: string;
    }>;
    createPerson(createDto: any): Promise<{
        message: string;
    }>;
    getPerson(id: string): Promise<{
        message: string;
    }>;
    updatePerson(id: string, updateDto: any): Promise<{
        message: string;
    }>;
    deletePerson(id: string): Promise<{
        message: string;
    }>;
}
