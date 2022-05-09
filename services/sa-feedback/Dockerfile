FROM mcr.microsoft.com/dotnet/sdk:2.1 AS build

COPY *.csproj ./app/
COPY . ./app/
WORKDIR /app
RUN dotnet publish -c Release -o out

ENV DATABASE_DIR=./

FROM mcr.microsoft.com/dotnet/aspnet:2.1 AS runtime
WORKDIR /app
COPY --from=build /app/out ./
ENTRYPOINT ["dotnet", "SA.Feedback.dll"]