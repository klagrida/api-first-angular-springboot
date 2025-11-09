# Complete Setup Guide

This guide covers all aspects of setting up the API-First Task Manager project, including Maven Wrapper, Git configuration, and environment setup.

## Table of Contents

1. [Maven Wrapper](#maven-wrapper)
2. [Git Attributes](#git-attributes)
3. [Prerequisites Installation](#prerequisites-installation)
4. [Local Development Setup](#local-development-setup)
5. [CI/CD Configuration](#cicd-configuration)

---

## Maven Wrapper

### What is Maven Wrapper?

Maven Wrapper (`mvnw`) is a script that automatically downloads and uses the correct Maven version for your project. Benefits:

- ✅ No need to install Maven globally
- ✅ Ensures everyone uses the same Maven version
- ✅ Works on Windows, Linux, and macOS
- ✅ CI/CD friendly

### Files Included

```
backend/
├── mvnw                    # Unix/Linux/macOS wrapper script
├── mvnw.cmd                # Windows wrapper script
└── .mvn/
    └── wrapper/
        ├── maven-wrapper.jar          # Wrapper executable
        └── maven-wrapper.properties   # Maven version config
```

### Usage

**Instead of `mvn`, use `./mvnw`:**

```bash
# Unix/Linux/macOS
cd backend
./mvnw clean install
./mvnw spring-boot:run
./mvnw test

# Windows
cd backend
mvnw.cmd clean install
mvnw.cmd spring-boot:run
mvnw.cmd test
```

### First Run

On first run, the wrapper will:
1. Download Maven 3.9.5 (specified in maven-wrapper.properties)
2. Cache it in `~/.m2/wrapper`
3. Execute your command

**Example:**
```bash
$ ./mvnw --version
Downloading Maven 3.9.5...
Downloaded Maven 3.9.5
Apache Maven 3.9.5
Maven home: /home/user/.m2/wrapper/dists/apache-maven-3.9.5
Java version: 17.0.8
```

### Updating Maven Version

Edit `backend/.mvn/wrapper/maven-wrapper.properties`:

```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
```

Then delete `~/.m2/wrapper` and run `./mvnw` again.

### Troubleshooting Maven Wrapper

**Problem: Permission denied**
```bash
chmod +x backend/mvnw
./mvnw --version
```

**Problem: Wrapper downloads every time**
```bash
# Check wrapper JAR exists
ls -la backend/.mvn/wrapper/maven-wrapper.jar

# If missing, download manually
cd backend
curl -L -o .mvn/wrapper/maven-wrapper.jar \
  https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
```

**Problem: Network/proxy issues**
```bash
# Set proxy for Maven
export MAVEN_OPTS="-Dhttp.proxyHost=proxy.example.com -Dhttp.proxyPort=8080"
./mvnw clean install
```

---

## Git Attributes

### What is .gitattributes?

`.gitattributes` ensures consistent file handling across different operating systems, preventing issues with:
- Line endings (CRLF vs LF)
- Binary files corruption
- Merge conflicts in generated files

### Key Configurations

#### Line Endings

**Unix-style (LF):**
```gitattributes
*.java text eol=lf
*.ts text eol=lf
*.sh text eol=lf
mvnw text eol=lf
```

**Windows-style (CRLF):**
```gitattributes
*.bat text eol=crlf
*.cmd text eol=crlf
mvnw.cmd text eol=crlf
```

#### Binary Files

```gitattributes
*.jar binary
*.png binary
*.pdf binary
```

#### Generated Code

```gitattributes
**/generated/** linguist-generated
```

This tells GitHub to:
- Exclude from language statistics
- Collapse in diffs by default

### Why This Matters

**Without .gitattributes:**
```bash
# On Windows
git add mvnw
# File saved with CRLF line endings

# On Linux
./mvnw clean install
# Error: /bin/sh^M: bad interpreter
```

**With .gitattributes:**
```bash
# mvnw always has LF endings, works everywhere
./mvnw clean install  # ✅ Works on all platforms
```

### Verifying Line Endings

```bash
# Check line endings
file backend/mvnw
# Output: backend/mvnw: Bourne-Again shell script, ASCII text executable

# On Windows, verify LF endings
dos2unix -i backend/mvnw
# Output: 0  0  backend/mvnw (LF)
```

---

## Prerequisites Installation

### Java 17+

**Windows:**
```powershell
# Using winget
winget install EclipseAdoptium.Temurin.17.JDK

# Verify
java -version
```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@17

# Verify
java -version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Verify
java -version
```

### Node.js 20+

**Windows:**
```powershell
# Using winget
winget install OpenJS.NodeJS

# Verify
node -v
npm -v
```

**macOS:**
```bash
# Using Homebrew
brew install node@20

# Verify
node -v
npm -v
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v
npm -v
```

### Git Configuration

```bash
# Configure line endings (one-time setup)
git config --global core.autocrlf input  # Linux/macOS
git config --global core.autocrlf true   # Windows

# Verify
git config --get core.autocrlf
```

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/api_first_angular_springboot.git
cd api_first_angular_springboot
```

### Step 2: Verify Files

```bash
# Check Maven wrapper
ls -la backend/mvnw backend/mvnw.cmd backend/.mvn/wrapper/

# Verify wrapper is executable
test -x backend/mvnw && echo "✅ mvnw is executable" || echo "❌ Need chmod +x"

# Fix if needed
chmod +x backend/mvnw
```

### Step 3: Generate API Code

```bash
# Backend (using Maven wrapper)
cd backend
./mvnw generate-sources

# Frontend
cd ../frontend
npm install
npm run generate-api
```

### Step 4: Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Wait for:
```
Started TaskManagerApplication in 3.456 seconds
```

### Step 5: Start Frontend

```bash
# In new terminal
cd frontend
npm start
```

Wait for:
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 6: Verify Setup

Open browser: http://localhost:4200

**Backend health check:**
```bash
curl http://localhost:8080/api/v1/tasks
# Should return: []
```

**Create a task:**
```bash
curl -X POST http://localhost:8080/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","completed":false}'
# Should return task with ID
```

---

## CI/CD Configuration

### GitHub Actions Setup

The workflow automatically uses Maven wrapper. No setup needed!

**Key features:**
```yaml
- name: Make Maven Wrapper executable
  run: chmod +x backend/mvnw

- name: Build with Maven Wrapper
  run: |
    cd backend
    ./mvnw clean package
```

### Local Testing of CI Pipeline

**Test Maven build:**
```bash
cd backend
./mvnw clean verify
```

**Test OpenAPI generation:**
```bash
npx @openapitools/openapi-generator-cli validate -i api/task-api.yaml
```

**Test frontend build:**
```bash
cd frontend
npm ci
npm run build --prod
```

---

## Common Issues and Solutions

### Issue: mvnw permission denied

**Solution:**
```bash
chmod +x backend/mvnw
git add backend/mvnw
git commit -m "fix: make mvnw executable"
```

### Issue: Line ending problems on Windows

**Solution:**
```bash
# Normalize all files
git add --renormalize .
git status  # Check what changed
git commit -m "chore: normalize line endings"
```

### Issue: Maven wrapper not found in CI

**Cause:** Maven wrapper JAR not committed

**Solution:**
```bash
# Verify .gitignore allows wrapper
grep -v "^#" .gitignore | grep maven-wrapper

# Should NOT ignore these:
# !backend/.mvn/wrapper/maven-wrapper.jar
# !backend/.mvn/wrapper/maven-wrapper.properties

# Commit the wrapper
git add -f backend/.mvn/wrapper/maven-wrapper.jar
git commit -m "chore: add maven wrapper jar"
```

### Issue: Generated code has wrong line endings

**Solution:**
The `.gitattributes` file prevents this. If you see issues:
```bash
# Re-normalize
git add --renormalize backend/target/generated-sources/
git add --renormalize frontend/src/app/generated/

# Commit
git commit -m "chore: normalize generated code line endings"
```

---

## Best Practices

### For Development

1. **Always use Maven wrapper** (`./mvnw` not `mvn`)
2. **Check line endings** before committing
3. **Run tests locally** before pushing
4. **Verify wrapper is executable** after clone

### For CI/CD

1. **Always make wrapper executable** in CI
2. **Cache Maven dependencies** for faster builds
3. **Use wrapper in all Maven commands**
4. **Commit wrapper JAR** to repository

### For Team

1. **Document wrapper usage** in README
2. **Include .gitattributes** in all projects
3. **Set up pre-commit hooks** for line endings
4. **Educate team** on cross-platform issues

---

## Quick Command Reference

### Maven Wrapper Commands

```bash
# Build
./mvnw clean install

# Run app
./mvnw spring-boot:run

# Run tests
./mvnw test

# Generate code
./mvnw generate-sources

# Check dependencies
./mvnw dependency:tree

# Update version
./mvnw versions:set -DnewVersion=2.0.0
```

### Git Commands

```bash
# Check file attributes
git check-attr -a backend/mvnw

# View line endings
git ls-files --eol backend/mvnw

# Normalize line endings
git add --renormalize .

# View .gitattributes effect
git ls-files | while read f; do
  git check-attr text eol $f
done
```

---

## Additional Resources

- [Maven Wrapper Documentation](https://maven.apache.org/wrapper/)
- [Git Attributes Documentation](https://git-scm.com/docs/gitattributes)
- [Spring Boot Maven Plugin](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/html/)
- [Cross-Platform Development Guide](https://docs.github.com/en/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)

---

**Next Steps:**
- Read [QUICK-START.md](./QUICK-START.md) for rapid setup
- Check [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) for pipeline details
- Review [README.md](./README.md) for complete documentation
