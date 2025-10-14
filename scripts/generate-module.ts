#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';

const program = new Command();

program
    .name('generate-module')
    .description('Generate or remove a module')
    .argument('<moduleName>', 'name of the module')
    .option('-c, --crud', 'generate full CRUD module')
    .option('-b, --basic', 'generate basic module with minimal routes')
    .option('-r, --remove', 'remove an existing module')
    .action((moduleName: string, options: any) => {
        const { crud, basic, remove } = options;

        if (remove) {
            // Remove module
            const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);
            if (!fs.existsSync(moduleDir)) {
                console.error(`Error: Module '${moduleName}' does not exist.`);
                process.exit(1);
            }

            // Remove directory
            fs.rmSync(moduleDir, { recursive: true, force: true });
            console.log(`Removed module directory: ${moduleDir}`);

            // Update api.ts
            const apiPath = path.join(__dirname, '..', 'src', 'api.ts');
            let apiContent = fs.readFileSync(apiPath, 'utf-8').split('\n');

            // Remove import
            apiContent = apiContent.filter(line => !line.includes(`import { ${moduleName}Routes } from './modules/${moduleName}/${moduleName}.routes';`));

            // Remove app.use
            apiContent = apiContent.filter(line => !line.includes(`app.use(env.API_PREFIX, ${moduleName}Routes);`));

            fs.writeFileSync(apiPath, apiContent.join('\n'));
            console.log(`Updated api.ts to remove ${moduleName} routes`);
            console.log(`Module ${moduleName} removed successfully!`);
            return;
        }

        // Generate module
        const type = crud ? 'crud' : 'basic';

        const moduleDir = path.join(__dirname, '..', 'src', 'modules', moduleName);
        const capitalizedModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        const pluralModule = moduleName + 's';

        // Check for duplication
        if (fs.existsSync(moduleDir)) {
            console.error(`Error: Module '${moduleName}' already exists. Use -r to delete it first.`);
            process.exit(1);
        }

        // Create module directory
        fs.mkdirSync(moduleDir, { recursive: true });// Templates
        const basicControllerTemplate = `import { Request, Response, NextFunction, Router } from 'express';
import { ${moduleName}Service } from './${moduleName}.service';

class ${capitalizedModule}Controller {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/hello', this.hello);
    }

    private async hello(req: Request, res: Response, next: NextFunction) {
        try {
            const ${moduleName} = await ${moduleName}Service.hello();
            res.status(200).json(${moduleName});
        } catch (error) {
            next(error);
        }
    }
}

export const ${moduleName}Controller = new ${capitalizedModule}Controller();
`;

        const basicServiceTemplate = `export class ${capitalizedModule}Service {
    public hello = async () => {
        return { message: 'Hello from ${capitalizedModule} service' };
    }
}

export const ${moduleName}Service = new ${capitalizedModule}Service();
`;

        const basicRoutesTemplate = `import { Router } from 'express';
import { ${moduleName}Controller } from './${moduleName}.controller';

const router = Router();

router.use('/${pluralModule}', ${moduleName}Controller.router);

export { router as ${moduleName}Routes };
`;

        const controllerTemplate = `import { Request, Response, NextFunction, Router } from 'express';
import { ${moduleName}Service } from './${moduleName}.service';

class ${capitalizedModule}Controller {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.getAll${capitalizedModule}s);
        this.router.get('/:id', this.get${capitalizedModule}ById);
        this.router.post('/', this.create${capitalizedModule});
        this.router.put('/:id', this.update${capitalizedModule});
        this.router.delete('/:id', this.delete${capitalizedModule});
    }

    private async getAll${capitalizedModule}s(req: Request, res: Response, next: NextFunction) {
        try {
            const ${pluralModule} = await ${moduleName}Service.getAll${capitalizedModule}s();
            res.json(${pluralModule});
        } catch (error) {
            next(error);
        }
    }

    private async get${capitalizedModule}ById(req: Request, res: Response, next: NextFunction) {
        try {
            const ${moduleName} = await ${moduleName}Service.get${capitalizedModule}ById(req.params.id);
            res.json(${moduleName});
        } catch (error) {
            next(error);
        }
    }

    private async create${capitalizedModule}(req: Request, res: Response, next: NextFunction) {
        try {
            const new${capitalizedModule} = await ${moduleName}Service.create${capitalizedModule}(req.body);
            res.status(201).json(new${capitalizedModule});
        } catch (error) {
            next(error);
        }
    }

    private async update${capitalizedModule}(req: Request, res: Response, next: NextFunction) {
        try {
            const updated${capitalizedModule} = await ${moduleName}Service.update${capitalizedModule}(req.params.id, req.body);
            res.json(updated${capitalizedModule});
        } catch (error) {
            next(error);
        }
    }

    private async delete${capitalizedModule}(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ${moduleName}Service.delete${capitalizedModule}(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const ${moduleName}Controller = new ${capitalizedModule}Controller();
`;

        const serviceTemplate = `export class ${capitalizedModule}Service {
    // Business logic for ${moduleName} module
    public getAll${capitalizedModule}s = async () => {
        // Logic to get all ${pluralModule}
        return [
            { id: 1, name: 'Sample ${capitalizedModule}' },
            { id: 2, name: 'Another ${capitalizedModule}' }
        ];
    }

    public get${capitalizedModule}ById = async (id: string) => {
        // Logic to get a ${moduleName} by ID
        return {
            id: id, name: 'Sample ${capitalizedModule}'
        }
    }

    public create${capitalizedModule} = async (data: any) => {
        // Logic to create a new ${moduleName}
        return { id: 'new-id', ...data };
    }

    public update${capitalizedModule} = async (id: string, data: any) => {
        // Logic to update a ${moduleName}
        return { id: id, ...data };
    }

    public delete${capitalizedModule} = async (id: string) => {
        // Logic to delete a ${moduleName}
        return { message: \`${capitalizedModule} with id \${id} deleted.\` };
    }
}

export const ${moduleName}Service = new ${capitalizedModule}Service();
`;

        const routesTemplate = `import { Router } from 'express';
import { ${moduleName}Controller } from './${moduleName}.controller';

const router = Router();

router.use('/${pluralModule}', ${moduleName}Controller.router);

export { router as ${moduleName}Routes };
`;

        const typesTemplate = `// This file contains type definitions for the ${moduleName} module.
`;

        const dtosTemplate = `// Data Transfer Objects (DTOs) for ${moduleName} module
`;

        const validatorsTemplate = `// This file contains validation schemas for the ${moduleName} module using Zod or Joi or any other validation library.
`;

        const middlewareTemplate = `// ${moduleName} middleware
`;

        const utilsTemplate = `// Utility functions for ${moduleName} module
`;

        // Create files
        const files = [
            { name: `${moduleName}.controller.ts`, content: type === 'basic' ? basicControllerTemplate : controllerTemplate },
            { name: `${moduleName}.service.ts`, content: type === 'basic' ? basicServiceTemplate : serviceTemplate },
            { name: `${moduleName}.routes.ts`, content: type === 'basic' ? basicRoutesTemplate : routesTemplate },
            { name: `${moduleName}.types.ts`, content: typesTemplate },
            { name: `${moduleName}.dtos.ts`, content: dtosTemplate },
            { name: `${moduleName}.validators.ts`, content: validatorsTemplate },
            { name: `${moduleName}.middleware.ts`, content: middlewareTemplate },
            { name: `${moduleName}.utils.ts`, content: utilsTemplate },
        ];

        files.forEach(file => {
            const filePath = path.join(moduleDir, file.name);
            fs.writeFileSync(filePath, file.content);
            console.log(`Created ${filePath}`);
        });

        console.log(`Module ${moduleName} generated successfully!`);

        // Update api.ts to include the new routes
        const apiPath = path.join(__dirname, '..', 'src', 'api.ts');
        let apiContent = fs.readFileSync(apiPath, 'utf-8').split('\n');

        // Find last import for routes
        let lastImportIndex = -1;
        for (let i = 0; i < apiContent.length; i++) {
            if (/import \{ \w+Routes \} from '\.\/modules\//.test(apiContent[i])) {
                lastImportIndex = i;
            }
        }
        if (lastImportIndex !== -1) {
            apiContent.splice(lastImportIndex + 1, 0, `import { ${moduleName}Routes } from './modules/${moduleName}/${moduleName}.routes';`);
        }

        // Find last app.use for routes
        let lastUseIndex = -1;
        for (let i = 0; i < apiContent.length; i++) {
            if (/app\.use\(env\.API_PREFIX, \w+Routes\);/.test(apiContent[i])) {
                lastUseIndex = i;
            }
        }
        if (lastUseIndex !== -1) {
            apiContent.splice(lastUseIndex + 1, 0, `app.use(env.API_PREFIX, ${moduleName}Routes);`);
        }

        fs.writeFileSync(apiPath, apiContent.join('\n'));
        console.log(`Updated api.ts to include ${moduleName} routes`);
    });

program.parse();