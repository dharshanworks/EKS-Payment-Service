# EKS Payment Service – GitOps-Based Kubernetes Deployment

A cloud-native Node.js payment microservice deployed on **Amazon Elastic Kubernetes Service (EKS)** using Docker, Kubernetes, Helm and ArgoCD. The project demonstrates containerization, Kubernetes orchestration, GitOps-based continuous delivery, AWS load balancing and Prometheus application monitoring.

The target architecture also includes GitHub Actions CI, Amazon ECR, AWS Secrets Manager, IAM Roles for Service Accounts (IRSA) and Grafana observability.

> **Project:** EKS Payment Service  
> **Category:** Cloud / DevOps / Kubernetes  
> **Application:** Node.js + Express.js  
> **Cloud Platform:** Amazon Web Services (AWS)  
> **Deployment:** Kubernetes + Helm + ArgoCD

---

## Table of Contents

1. Project Overview
2. Architecture
3. Technology Stack
4. Application Features
5. Repository Structure
6. Application API Endpoints
7. Docker Containerization
8. Kubernetes Deployment
9. Helm Configuration
10. GitOps with ArgoCD
11. AWS EKS Architecture
12. AWS Application Load Balancer
13. Monitoring with Prometheus and Grafana
14. AWS Secrets Manager and IRSA
15. CI/CD Pipeline
16. Troubleshooting
17. Deployment Verification
18. Security Considerations
19. Implementation Status
20. Future Improvements

---

## 1. Project Overview

The EKS Payment Service project demonstrates how to containerize a backend application and deploy it to Amazon EKS using Kubernetes and GitOps practices.

The application is developed using Node.js and Express.js. It exposes REST endpoints for simulated payment processing, application health checks and Prometheus metrics.

The deployment architecture uses:

- Docker for application containerization.
- Amazon ECR for container image storage.
- Amazon EKS for Kubernetes orchestration.
- Helm for Kubernetes application packaging.
- ArgoCD for GitOps-based continuous delivery.
- AWS ALB Ingress for external application access.
- Prometheus for metrics collection.
- Grafana for metrics visualization.
- AWS Secrets Manager and IRSA as the target secrets-management and workload-identity integration.

### Project Objectives

- Build and containerize a Node.js microservice.
- Deploy the application on Amazon EKS.
- Manage Kubernetes resources through Helm charts.
- Implement GitOps-based deployment using ArgoCD.
- Configure automated synchronization.
- Expose the application through AWS Application Load Balancer.
- Collect application metrics using Prometheus.
- Design secure AWS workload access using IAM and IRSA.

**Note:** The application currently simulates payment processing. It does not perform actual financial transactions or integrate with an external payment gateway.

---

## 2. Architecture

### Target Architecture

```mermaid
flowchart TD
    DEV[Developer] --> GH[GitHub Repository]

    GH --> CI[GitHub Actions CI]
    CI --> BUILD[Docker Build and Test]
    BUILD --> ECR[Amazon ECR]

    GH --> ARGO[ArgoCD]
    ARGO -->|GitOps Auto-Sync| EKS[Amazon EKS]

    ECR -->|Image Pull| POD[Payment Service Pods]
    EKS --> HELM[Helm Chart]
    HELM --> POD

    USER[External Users] --> ALB[AWS Application Load Balancer]
    ALB --> ING[Ingress]
    ING --> SVC[Kubernetes Service]
    SVC --> POD

    POD --> METRICS[/metrics]
    METRICS --> PROM[Prometheus]
    PROM --> GRAF[Grafana]

    SM[AWS Secrets Manager] --> ESO[External Secrets Integration]
    IRSA[IAM Role for Service Account] --> ESO
    ESO --> K8S[Kubernetes Secret]
    K8S --> POD
```

The diagram represents the intended end-to-end architecture. Components marked as pending in the implementation-status section require additional configuration before the entire architecture can be considered operational.

### CI Pipeline

```text
Developer
    |
    v
GitHub
    |
    v
GitHub Actions
    |
    v
Source Code Checkout
    |
    v
Build and Test
    |
    v
Docker Image Build
    |
    v
Amazon ECR
```

### CD Pipeline

```text
GitHub Repository
       |
       v
    ArgoCD
       |
       v
  Detect Git Changes
       |
       v
  Helm Chart Rendering
       |
       v
  Auto-Sync
       |
       v
  Amazon EKS
       |
       v
Payment Service Deployment
```

**Important:** ECR stores container images. ArgoCD reads Kubernetes deployment configuration from Git. The CI pipeline must update the image tag in the deployment configuration when a new image is published.

---

## 3. Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Programming | Node.js | Backend runtime |
| Framework | Express.js | REST API development |
| Metrics | prom-client | Application metrics |
| Containerization | Docker | Container image creation |
| Cloud | AWS | Cloud infrastructure |
| Kubernetes | Amazon EKS | Container orchestration |
| Registry | Amazon ECR | Docker image storage |
| Packaging | Helm | Kubernetes resource management |
| GitOps | ArgoCD | Continuous delivery |
| Load Balancing | AWS ALB | External traffic routing |
| Monitoring | Prometheus | Metrics collection |
| Visualization | Grafana | Monitoring dashboards |
| Security | AWS IAM | Access control |
| Secrets | AWS Secrets Manager | Secure credential storage |
| Workload Identity | IRSA | IAM permissions for EKS workloads |
| CI | GitHub Actions | Automated build and test workflow |

---

## 4. Application Features

### Payment API

A simulated payment-processing endpoint that returns a successful response and increments a Prometheus counter.

### Health Check

Provides application health information through a dedicated endpoint.

### Metrics Endpoint

Exposes application and Node.js runtime metrics in Prometheus format.

### Containerization

Packages the application and its dependencies using Docker.

### Kubernetes Deployment

Runs the application as Kubernetes Pods managed by a Deployment.

### Helm Deployment

Uses configurable Helm values to manage Kubernetes resources.

### GitOps Deployment

Uses ArgoCD to monitor Git-based desired state and synchronize application resources.

### External Application Access

Uses Kubernetes Ingress configured for AWS Application Load Balancer integration.

---

## 5. Repository Structure

```text
EKS-Payment-Service/
│
├── app.js
│
├── package.json
├── package-lock.json
│
├── Dockerfile
│
├── helm/
│   └── payment-service/
│       │
│       ├── Chart.yaml
│       ├── values.yaml
│       │
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
│
├── argocd-application.yaml
│
├── payment-service-monitor.yaml
│
├── secrets-policy.json
│
└── README.md
```

### Important Files

| File | Responsibility |
|---|---|
| `app.js` | Express application and metrics implementation |
| `package.json` | Node.js dependencies and scripts |
| `Dockerfile` | Docker image configuration |
| `Chart.yaml` | Helm chart metadata |
| `values.yaml` | Configurable deployment values |
| `deployment.yaml` | Kubernetes Deployment |
| `service.yaml` | Kubernetes Service |
| `ingress.yaml` | AWS ALB Ingress |
| `argocd-application.yaml` | ArgoCD Application configuration |
| `payment-service-monitor.yaml` | Prometheus ServiceMonitor |
| `secrets-policy.json` | IAM policy example for Secrets Manager |

---

## 6. Application API Endpoints

The application runs on port **5000**.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Application welcome response |
| GET | `/payment` | Simulated payment processing |
| GET | `/health` | Application health status |
| GET | `/metrics` | Prometheus metrics endpoint |

### Home Endpoint

```http
GET /
```

Response:

```text
Welcome to Payment Service
```

### Payment Endpoint

```http
GET /payment
```

Response:

```json
{
  "status": "success",
  "message": "Payment Processed Successfully"
}
```

Each request increments the `payment_requests_total` counter.

### Health Endpoint

```http
GET /health
```

Response:

```json
{
  "status": "UP"
}
```

### Metrics Endpoint

```http
GET /metrics
```

Exposes application metrics in Prometheus exposition format.

Example custom metric:

```text
payment_requests_total 10
```

The actual value depends on the number of requests received since application startup.

---

## 7. Docker Containerization

Docker packages the Node.js application and its dependencies into a container image.

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Instructions

| Instruction | Explanation |
|---|---|
| FROM | Defines the base image |
| WORKDIR | Sets the working directory |
| COPY | Copies application files |
| RUN | Installs application dependencies |
| EXPOSE | Documents the application port |
| CMD | Defines the container startup command |

### Build Docker Image

```bash
docker build -t payment-service:v1 .
```

### View Docker Images

```bash
docker images
```

### Run Container

```bash
docker run -d \
  --name payment-service \
  -p 5000:5000 \
  payment-service:v1
```

### Verify Application

```bash
curl http://localhost:5000/

curl http://localhost:5000/health

curl http://localhost:5000/payment

curl http://localhost:5000/metrics
```

### View Container Logs

```bash
docker logs payment-service
```

### Stop Container

```bash
docker stop payment-service
```

---

## 8. Kubernetes Deployment

Kubernetes manages the lifecycle of containerized applications.

The payment service is deployed using a Kubernetes Deployment and exposed internally using a ClusterIP Service.

### Kubernetes Deployment

The Helm Deployment template configures:

- Application name: `payment-service`
- Replica count: 2
- Container image: Amazon ECR image
- Container port: 5000
- ServiceAccount: `payment-service`

### Verify Kubernetes Resources

```bash
kubectl get nodes

kubectl get pods

kubectl get deployments

kubectl get services

kubectl get ingress
```

### Describe Deployment

```bash
kubectl describe deployment payment-service
```

### View Application Logs

```bash
kubectl logs -f deployment/payment-service
```

### Scale Application

```bash
kubectl scale deployment payment-service --replicas=3
```

### Verify Rollout

```bash
kubectl rollout status deployment/payment-service
```

### Restart Deployment

```bash
kubectl rollout restart deployment/payment-service
```

---

## 9. Helm Configuration

Helm is a Kubernetes package manager used to manage Kubernetes application resources through reusable templates.

### Helm Chart Structure

```text
payment-service/
│
├── Chart.yaml
├── values.yaml
│
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

### Current Configuration

The existing `values.yaml` defines:

```yaml
replicaCount: 2

image:
  repository: YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/payment-service
  tag: "v1"
  pullPolicy: IfNotPresent

serviceAccount:
  create: false
  name: payment-service

service:
  type: ClusterIP
  port: 5000

ingress:
  enabled: true
  className: alb
```

Replace the image repository with your actual ECR repository.

### Validate Helm Chart

```bash
helm lint ./helm/payment-service
```

### Preview Kubernetes Manifests

```bash
helm template payment-service ./helm/payment-service
```

### Install Helm Release

```bash
helm install payment-service ./helm/payment-service \
  -n default
```

### Upgrade Helm Release

```bash
helm upgrade payment-service ./helm/payment-service \
  -n default
```

### List Helm Releases

```bash
helm list -A
```

### Check Helm Release

```bash
helm status payment-service -n default
```

**Note:** The current ArgoCD Application uses the Helm chart directly from Git. If ArgoCD manages the release, avoid independently managing the same resources with Helm CLI.

---

## 10. GitOps with ArgoCD

ArgoCD is a declarative GitOps continuous delivery tool for Kubernetes.

It continuously compares the desired application configuration stored in Git with the actual cluster state.

### GitOps Workflow

1. Developer modifies application or deployment configuration.
2. Changes are pushed to GitHub.
3. ArgoCD monitors the configured Git repository.
4. ArgoCD detects configuration differences.
5. ArgoCD renders the Helm chart.
6. ArgoCD automatically synchronizes Kubernetes resources when Auto-Sync is enabled.
7. Kubernetes controllers reconcile the application state.

### ArgoCD Application Configuration

The repository includes an ArgoCD Application manifest.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application

metadata:
  name: payment-service
  namespace: argocd

spec:
  project: default

  source:
    repoURL: https://github.com/dharshanworks/EKS-Payment-Service.git
    targetRevision: main
    path: helm/payment-service

  destination:
    server: https://kubernetes.default.svc
    namespace: default

  syncPolicy:
    automated:
      prune: true
      selfHeal: true

    syncOptions:
      - CreateNamespace=true
```

### Auto-Sync

Auto-Sync automatically applies changes from the Git repository.

### Prune

Removes resources managed by ArgoCD that are no longer present in the desired configuration.

### Self-Heal

Reconciles supported manual changes made directly to the cluster.

### ArgoCD Commands

```bash
argocd app list

argocd app get payment-service

argocd app diff payment-service

argocd app sync payment-service
```

---

## 11. AWS EKS Architecture

Amazon Elastic Kubernetes Service is a managed Kubernetes service provided by AWS.

It manages the Kubernetes control plane while worker workloads run using supported compute options such as EC2 managed node groups.

### Main Components

| AWS Component | Responsibility |
|---|---|
| Amazon EKS | Managed Kubernetes control plane |
| Amazon EC2 | Worker-node compute |
| Amazon VPC | Network isolation |
| Subnets | Network segmentation |
| IAM | Identity and permissions |
| Security Groups | Network traffic control |
| Amazon ECR | Container image registry |
| Application Load Balancer | External application traffic |

### EKS Cluster Verification

```bash
aws eks list-clusters --region us-east-1
```

### Configure kubectl

```bash
aws eks update-kubeconfig \
  --region us-east-1 \
  --name YOUR_CLUSTER_NAME
```

### Verify Cluster Connection

```bash
kubectl cluster-info

kubectl get nodes
```

---

## 12. AWS Application Load Balancer

The application is designed to be exposed externally through AWS Application Load Balancer using Kubernetes Ingress.

The AWS Load Balancer Controller watches Kubernetes Ingress resources and provisions/configures AWS load-balancing resources.

### Traffic Flow

```text
External User
     |
     v
AWS Application Load Balancer
     |
     v
Kubernetes Ingress
     |
     v
Kubernetes Service
     |
     v
Payment Service Pods
```

### Ingress Configuration

The current Ingress configuration uses:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: payment-service

  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip

spec:
  ingressClassName: alb

  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix

            backend:
              service:
                name: payment-service
                port:
                  number: 5000
```

### Important Components

- `internet-facing`: Creates a publicly accessible ALB.
- `target-type: ip`: Routes traffic directly to Pod IP targets.
- `ingressClassName: alb`: Uses the AWS Load Balancer Controller.
- `pathType: Prefix`: Matches requests beginning with the configured path.

The controller, its IAM permissions, networking and subnet discovery must be configured in the EKS cluster.

---

## 13. Monitoring with Prometheus and Grafana

Prometheus is used to collect application metrics, while Grafana provides dashboards and visualizations.

### Monitoring Architecture

```text
Payment Service
      |
      v
 /metrics Endpoint
      |
      v
Prometheus ServiceMonitor
      |
      v
Prometheus Server
      |
      v
Grafana Dashboard
```

### Application Metrics

The Node.js application uses the `prom-client` library.

It collects default Node.js metrics and exposes a custom payment counter.

```javascript
const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const paymentCounter = new client.Counter({
  name: "payment_requests_total",
  help: "Total number of payment requests",
});

register.registerMetric(paymentCounter);
```

The payment endpoint increments the counter:

```javascript
paymentCounter.inc();
```

### ServiceMonitor Configuration

The repository includes a ServiceMonitor intended to scrape the application metrics.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor

metadata:
  name: payment-service
  namespace: monitoring

  labels:
    release: monitoring

spec:
  selector:
    matchLabels:
      app: payment-service

  namespaceSelector:
    matchNames:
      - default

  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

**Important configuration correction:**

The current ServiceMonitor selects a Service label `app: payment-service` and a named Service port `http`. The existing Service template does not define either of these. Correct the Service template as follows:

```yaml
apiVersion: v1
kind: Service

metadata:
  name: payment-service

  labels:
    app: payment-service

spec:
  selector:
    app: payment-service

  ports:
    - name: http
      protocol: TCP
      port: 5000
      targetPort: 5000

  type: ClusterIP
```

This aligns the Service labels and port name with the ServiceMonitor.

The ServiceMonitor also requires the Prometheus Operator or a compatible monitoring stack, the relevant CRD and a Prometheus configuration that selects this ServiceMonitor.

### Example Prometheus Queries

Total payment requests:

```promql
payment_requests_total
```

Payment request rate:

```promql
rate(payment_requests_total[5m])
```

CPU utilization:

```promql
sum(rate(container_cpu_usage_seconds_total[5m]))
```

Memory usage:

```promql
sum(container_memory_working_set_bytes)
```

### Grafana

Grafana can connect to Prometheus as a data source and visualize:

- Payment request counts.
- Payment request rates.
- Application availability.
- CPU utilization.
- Memory utilization.
- Kubernetes Pod health.

A working Grafana dashboard requires Grafana installation, Prometheus data-source configuration and dashboard provisioning or import.

---

## 14. AWS Secrets Manager and IRSA

AWS Secrets Manager is designed to store sensitive application information such as API keys, database passwords and authentication credentials.

IRSA stands for **IAM Roles for Service Accounts**.

It enables Kubernetes workloads running on EKS to obtain temporary AWS credentials by associating a Kubernetes ServiceAccount with an IAM role.

### Intended Architecture

```text
AWS Secrets Manager
        |
        v
IAM Role
        |
        v
EKS OIDC Provider
        |
        v
Kubernetes ServiceAccount
        |
        v
Payment Service Pod
```

### IRSA Workflow

1. Configure an OIDC provider for the EKS cluster.
2. Create an IAM role.
3. Configure the role's trust policy for the EKS ServiceAccount.
4. Attach a least-privilege IAM policy.
5. Annotate the Kubernetes ServiceAccount with the IAM role ARN.
6. Assign that ServiceAccount to the payment-service Pod.
7. Retrieve secrets using an approved AWS integration.

### Example ServiceAccount

```yaml
apiVersion: v1
kind: ServiceAccount

metadata:
  name: payment-service
  namespace: default

  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT_ID:role/payment-service-role
```

The Deployment must use:

```yaml
spec:
  template:
    spec:
      serviceAccountName: payment-service
```

### Secrets Manager Integration

A common implementation uses External Secrets Operator:

```text
AWS Secrets Manager
        |
        v
External Secrets Operator
        |
        v
ExternalSecret Resource
        |
        v
Kubernetes Secret
        |
        v
Payment Service Pod
```

Another supported approach is AWS Secrets Store CSI Driver with the AWS Secrets and Configuration Provider.

The repository currently contains an IAM policy example but does not include a complete verified ExternalSecret, SecretProviderClass or IRSA ServiceAccount implementation.

### IAM Policy Security

The current `secrets-policy.json` uses a wildcard resource.

For production, restrict access to the required secret:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:payment-service/*"
    }
  ]
}
```

Replace the account ID and secret ARN with the actual resource identifiers.

---

## 15. CI/CD Pipeline with GitHub Actions

GitHub Actions is the intended CI component for automating application builds and container image publishing.

### Expected Workflow

1. Developer pushes code to GitHub.
2. GitHub Actions checks out the source code.
3. Dependencies are installed.
4. Application checks and tests are executed.
5. Docker image is built.
6. GitHub Actions authenticates with AWS using GitHub OIDC.
7. Image is pushed to Amazon ECR.
8. Deployment configuration is updated with the new image tag.
9. ArgoCD detects the Git change.
10. ArgoCD synchronizes the Kubernetes deployment.

### Image Tagging Strategy

Use a unique Git commit SHA instead of relying only on `latest`.

Example:

```text
payment-service:a1b2c3d4
```

Benefits:

- Traceability.
- Reproducible deployments.
- Easier rollback.
- Clear image version history.

### CI and CD Responsibilities

| Component | Responsibility |
|---|---|
| GitHub | Source code management |
| GitHub Actions | Build and test automation |
| Docker | Container image creation |
| ECR | Image storage |
| ArgoCD | Kubernetes configuration synchronization |
| EKS | Application execution |

**Security recommendation:** Use GitHub OIDC with a dedicated IAM role instead of storing permanent AWS access keys in GitHub repository secrets.

---

## 16. Troubleshooting

### 1. Pod CrashLoopBackOff

Possible causes:

- Application startup failure.
- Incorrect environment variables.
- Invalid container startup command.
- Application runtime exception.

Commands:

```bash
kubectl get pods

kubectl describe pod POD_NAME

kubectl logs POD_NAME --previous
```

### 2. ImagePullBackOff

Possible causes:

- Incorrect ECR image URI.
- Image tag does not exist.
- Missing image-pull permissions.
- ECR authentication or network issue.

Commands:

```bash
kubectl describe pod POD_NAME

aws ecr describe-images \
  --repository-name payment-service \
  --region us-east-1
```

### 3. Service Not Routing Traffic

Possible causes:

- Incorrect Service selector.
- Incorrect Pod labels.
- Incorrect target port.
- No ready endpoints.

Commands:

```bash
kubectl get svc

kubectl get endpoints payment-service

kubectl describe svc payment-service
```

### 4. ALB Ingress Not Working

Possible causes:

- AWS Load Balancer Controller not running.
- Incorrect subnet tags or discovery.
- Missing IAM permissions.
- Incorrect Ingress configuration.
- Security group restrictions.

Commands:

```bash
kubectl get ingress

kubectl describe ingress payment-service

kubectl get pods -n kube-system
```

### 5. ArgoCD OutOfSync

Possible causes:

- Git and cluster configurations differ.
- Manual changes were made to Kubernetes resources.
- Invalid Helm templates.
- Sync operation failed.

Commands:

```bash
argocd app get payment-service

argocd app diff payment-service

argocd app sync payment-service
```

### 6. Prometheus Not Scraping Metrics

Possible causes:

- ServiceMonitor selector mismatch.
- Service port name mismatch.
- Incorrect application labels.
- Prometheus not selecting the ServiceMonitor.
- Metrics endpoint unavailable.

Commands:

```bash
kubectl get servicemonitor -A

kubectl describe servicemonitor payment-service -n monitoring

kubectl get svc -n default

kubectl get endpoints -n default
```

---

## 17. Deployment Verification Checklist

Use this checklist to validate the deployment after implementing all required integrations.

### Application

- [ ] Node.js application starts successfully.
- [ ] Root endpoint returns a response.
- [ ] Payment endpoint works.
- [ ] Health endpoint returns HTTP 200.
- [ ] Metrics endpoint exposes Prometheus metrics.

### Docker and ECR

- [ ] Docker image builds successfully.
- [ ] Container runs locally.
- [ ] Image is tagged correctly.
- [ ] Image is pushed to Amazon ECR.
- [ ] EKS nodes can pull the image.

### Kubernetes and Helm

- [ ] EKS cluster is accessible.
- [ ] Worker nodes are ready.
- [ ] Helm chart passes validation.
- [ ] Deployment creates the expected replicas.
- [ ] Pods reach Running and Ready states.
- [ ] Service endpoints are available.

### ArgoCD

- [ ] ArgoCD Application is registered.
- [ ] Git repository connection works.
- [ ] Helm chart renders successfully.
- [ ] Auto-Sync is enabled.
- [ ] Prune and Self-Heal behavior are verified.
- [ ] Git changes are synchronized successfully.

### AWS Security

- [ ] EKS OIDC provider is configured.
- [ ] IAM role is configured for IRSA.
- [ ] ServiceAccount is annotated correctly.
- [ ] IAM permissions follow least privilege.
- [ ] Secrets Manager integration works.
- [ ] No permanent AWS credentials are embedded in application images.

### ALB and Monitoring

- [ ] AWS Load Balancer Controller is healthy.
- [ ] ALB is provisioned.
- [ ] External traffic reaches the application.
- [ ] ServiceMonitor selects the correct Service.
- [ ] Prometheus successfully scrapes application metrics.
- [ ] Grafana connects to Prometheus.
- [ ] Payment metrics are visible in Grafana.

---

## 18. Security Considerations

Security is an important aspect of deploying payment-related workloads.

Recommended practices:

- Never commit API keys or passwords to GitHub.
- Use AWS Secrets Manager for sensitive credentials.
- Use IRSA to provide workload-specific AWS permissions.
- Follow IAM least-privilege principles.
- Use GitHub OIDC for CI authentication.
- Use unique Docker image tags.
- Restrict network access through Security Groups.
- Use HTTPS with AWS Certificate Manager.
- Avoid privileged containers.
- Configure Kubernetes resource requests and limits.
- Scan Docker images for vulnerabilities.
- Regularly rotate application credentials.

---

## 19. Implementation Status

This table distinguishes the existing repository configuration from the complete target architecture.

| Component | Repository status |
|---|---|
| Node.js Express application | Implemented |
| Payment simulation endpoint | Implemented |
| Health endpoint | Implemented |
| Prometheus metrics endpoint | Implemented |
| Dockerfile | Implemented |
| Helm chart | Implemented |
| Kubernetes Deployment | Implemented |
| Kubernetes Service | Implemented; port/labels need correction |
| AWS ALB Ingress manifest | Implemented |
| ArgoCD Application | Implemented |
| ArgoCD Auto-Sync | Configured |
| Prometheus ServiceMonitor | Present; Service selector/port need correction |
| GitHub Actions workflow | Not verified |
| ECR image publishing workflow | Not verified |
| AWS Secrets Manager integration | Not verified |
| Complete IRSA configuration | Not verified |
| Grafana dashboard integration | Not verified |
| Real payment gateway | Not implemented |

A repository manifest does not prove that a corresponding AWS resource has been successfully provisioned. Validate the live EKS cluster before marking deployment requirements as complete.

---

## 20. Future Improvements

The following enhancements can make this project closer to a production-grade DevOps deployment:

1. Implement a complete GitHub Actions CI workflow.
2. Automate Docker image publishing to Amazon ECR.
3. Automate Git image-tag updates for ArgoCD.
4. Configure IRSA with an EKS OIDC provider.
5. Integrate AWS Secrets Manager with External Secrets Operator.
6. Implement Grafana dashboards for application metrics.
7. Add Kubernetes liveness, readiness and startup probes.
8. Configure CPU and memory requests and limits.
9. Implement Horizontal Pod Autoscaler.
10. Configure HTTPS using AWS Certificate Manager.
11. Add vulnerability scanning using Trivy.
12. Implement structured logging and centralized log collection.
13. Add application request validation and payment failure simulation.
14. Integrate a payment gateway in a future version.

---

## 21. Learning Outcomes

Through this project, the following DevOps and cloud-native concepts are demonstrated:

- Docker containerization.
- Kubernetes application orchestration.
- Amazon EKS architecture.
- Amazon ECR image management.
- Helm-based deployments.
- GitOps with ArgoCD.
- Automated synchronization.
- AWS Application Load Balancer integration.
- Prometheus application metrics.
- Kubernetes troubleshooting.
- AWS IAM and workload identity concepts.
- Secure secrets-management architecture.

---

## Author

**Dharshan R**

B.Tech Information Technology  
Sri Shakthi Institute of Engineering and Technology, Coimbatore

- GitHub: [dharshanworks](https://github.com/dharshanworks)
- Project: [EKS Payment Service](https://github.com/dharshanworks/EKS-Payment-Service)

---

**Project Focus:** Building and understanding a cloud-native application deployment workflow using Docker, Kubernetes, Amazon EKS, Helm, ArgoCD and AWS services.
