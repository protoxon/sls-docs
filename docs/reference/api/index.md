# SLS API

These routes are the application facing HTTP endpoints on Protocube: operators and integrations use them with an application admin API key (AppAdmin scope).

## S4J (Java client) {#s4j-java-client}

[S4J](https://github.com/jessefaler/SLS/tree/main/S4J) is the Java wrapper for this API. For setup, patterns (`SLSAction`, WebSocket events, rate limiting), and more examples, see the [**S4J README**](https://github.com/jessefaler/SLS/blob/main/S4J/README.md).

### Using the S4J library in your project {#using-s4j-in-your-project}

[version]: https://img.shields.io/maven-metadata/v?metadataUrl=https%3A%2F%2Frepo1.maven.org%2Fmaven2%2Fio%2Fgithub%2Fprotoxon%2FS4J%2Fmaven-metadata.xml&color=informational&label=Maven%20Central
[github]: https://github.com/jessefaler/SLS/tree/main/S4J
[github-shield]: https://img.shields.io/badge/GitHub-S4J-181717?logo=github
[javadocs]: https://javadoc.io/doc/io.github.protoxon/S4J
[javadoc-shield]: https://javadoc.io/badge2/io.github.protoxon/S4J/javadoc.svg
[download]: #download

[ ![version][] ][download]
[ ![github-shield][] ][github]
[ ![javadoc-shield][] ][javadocs]

### Download {#download}

Latest version: [ ![version][] ][download]

Artifacts are on Maven Central

`https://repo1.maven.org/maven2/io/github/protoxon/S4J/`

Use the version from the badge above, or substitute `1.0.1` with a newer release when available.

**Maven**

```xml
<dependency>
    <groupId>io.github.protoxon</groupId>
    <artifactId>S4J</artifactId>
    <version>1.0.1</version>
</dependency>
```

**Gradle (Kotlin DSL)**

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    implementation("io.github.protoxon:S4J:1.0.1")
}
```

**Gradle (Groovy)**

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'io.github.protoxon:S4J:1.0.1'
}
```

**Javadoc:** [javadoc.io](https://javadoc.io/doc/io.github.protoxon/S4J)

Then create a client:

```java
import com.protoxon.S4J.SLSBuilder;
import com.protoxon.S4J.client.entities.SLSClient;

// Base URL = Protocube origin only
SLSClient client = SLSBuilder.createClient("https://protocube.example.com:5620", "sls_live_your_app_admin_key");
```

Most JSON endpoints below show **HTTP** and **S4J** side by side in a tab group.

## Base URL

All paths below are relative to your Protocube HTTP(S) origin, for example `https://protocube.example.com`.

## Authentication

Protected JSON routes live under **`/api/*`** (except the unauthenticated HTML pages on `/` and `/nodes`).

Send a **Bearer** token in the `Authorization` header:

```http
Authorization: Bearer sls_live_your_app_admin_key
```

Missing header, wrong format, invalid token, or missing **`AppAdmin`** scope yields `401` / `403` with a JSON error body (see below).

## Error responses

Many failures return JSON shaped like:

```json
{
  "code": "404",
  "status": "Not Found",
  "detail": "node not found: abc123",
  "hint": "The requested node was not found."
}
```

Some responses may also include `request_id` for log correlation.

## Sections

| Section | What’s inside |
| --- | --- |
| [Core endpoints](./core) | Nodes, system, servers, blueprints, reload (each endpoint titled with a one-line summary) |
| [Event streams](./events) | `GET /api/events/ws` — WebSocket · `GET /api/events` — SSE (same bus) |
| [Server management](./server-management) | All `/api/servers/:server` routes, each with a one-line summary in the heading |
| [Browser pages](./browser) | `GET /` — HTML banner · `GET /nodes` — HTML node list |
