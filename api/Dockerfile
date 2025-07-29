# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /app

# Copy csproj files and restore dependencies
COPY *.csproj ./
RUN dotnet restore TaskManagerApi.csproj

# Copy the rest of the source code
COPY . .

# Publish the app in Release mode to the /out folder
RUN dotnet publish TaskManagerApi.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app

# Copy published output from build image
COPY --from=build /app/out ./

EXPOSE 80

ENTRYPOINT ["dotnet", "TaskManagerApi.dll"]
