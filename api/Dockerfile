# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /app

# Copy csproj files and restore dependencies
COPY api/*.csproj ./api/
RUN dotnet restore ./api/TaskManagerApi.csproj

# Copy the rest of the source code
COPY api/. ./api/

# Publish the app in Release mode to the /out folder
RUN dotnet publish ./api/TaskManagerApi.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app

# Copy published output from build image
COPY --from=build /app/api/out ./

# Expose port 80 (optional)
EXPOSE 80

# Run the app
ENTRYPOINT ["dotnet", "TaskManagerApi.dll"]
