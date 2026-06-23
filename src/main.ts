import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:4200",
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Identity Auth API")
        .setDescription(
            "Reusable backend API for authentication, identity, applications, and sessions.",
        )
        .setVersion("1.0.0")
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, swaggerDocument);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
