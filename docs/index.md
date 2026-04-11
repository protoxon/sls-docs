---
layout: home

hero:
  name: SLS
  text: '<span class="home-hero-subtitle">Server Launch System</span>'
  tagline: |
    <span class="home-hero-tagline-lead">SLS is an open-source system for automating the deployment, scaling, and management of containerized game servers.</span>
  image:
    src: /logo-mark.svg
    alt: SLS
  actions:
    - theme: brand
      text: Read the guide
      link: /guide/introduction
    - theme: alt
      text: Reference
      link: /reference/overview

features:
  - icon: 📋
    title: Blueprints
    link: /guide/blueprints/introduction
    details: Describe the desired state of your servers in configuration; SLS provisions workloads across nodes from that definition.
  - icon: 🛡️
    title: Consistent & secure
    details: Run containerized game servers in reproducible environments so every deploy matches what you defined.
  - icon: 🔌
    title: API
    link: /reference/api/
    details: Create and manage servers at scale through the HTTP API.
---
