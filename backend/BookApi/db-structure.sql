IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Autores] (
    [Rut] nvarchar(450) NOT NULL,
    [NombreCompleto] nvarchar(max) NOT NULL,
    [FechaNacimiento] datetime2 NOT NULL,
    [Ciudad] nvarchar(max) NOT NULL,
    [Correo] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Autores] PRIMARY KEY ([Rut])
);

CREATE TABLE [Libros] (
    [Id] int NOT NULL IDENTITY,
    [Titulo] nvarchar(max) NOT NULL,
    [Anio] int NOT NULL,
    [Genero] nvarchar(max) NOT NULL,
    [NumeroPaginas] int NOT NULL,
    [AutorRut] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_Libros] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Libros_Autores_AutorRut] FOREIGN KEY ([AutorRut]) REFERENCES [Autores] ([Rut]) ON DELETE CASCADE
);

CREATE INDEX [IX_Libros_AutorRut] ON [Libros] ([AutorRut]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250515221108_Inicial', N'9.0.5');

COMMIT;
GO

