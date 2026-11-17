# EKS Payment Service – GitOps-Based Kubernetes Deployment

A Node.js payment microservice deployed on **Amazon EKS** using Docker, Kubernetes, Helm and ArgoCD. This project demonstrates containerized application deployment, GitOps-based continuous delivery, AWS infrastructure integration and Prometheus monitoring.

> **Project type:** DevOps / Cloud-Native Application Deployment  
> **Application:** Node.js + Express  
> **Cloud Platform:** AWS  
> **Orchestration:** Kubernetes (Amazon EKS)

## Architecture

### Target Architecture

```text
                  Developer
                      |
                      v
                 GitHub Repo
                      |
                      v
               GitHub Actions
               (CI Pipeline)
                      |
              Build & Test Docker
                      |
                      v
                 Amazon ECR
              (Image Registry)
                      |
                      v
             ArgoCD (GitOps CD)
                Auto-Sync
                      |
                      v
                Amazon EKS
                      |
              Helm Deployment
                      |
          +-----------+-----------+
          |                       |
          v                       v
    Payment Service          ALB Ingress
          |                       |
          v                       v
     Kubernetes Pods        External Users
          |
          +-----------------------+
          |
          v
    Prometheus Metrics
          |
          v
        Grafana

AWS Secrets Manager
          |
          v
    IRSA / IAM Role
          |
          v
  Secure Workload Access
```

**Note:** This diagram represents the intended architecture. GitHub Actions, AWS Secrets Manager/IRSA integration and Grafana dashboard configuration require implementation and verification before being described as completed features.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express.js |
| Containerization | Docker |
| Cloud | AWS |
| Kubernetes | Amazon EKS |
| Container Registry | Amazon ECR |
| Package Management | Helm |
| GitOps / CD | ArgoCD |
| CI | GitHub Actions (target workflow) |
| Load Balancing | AWS Application Load Balancer |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Security | AWS IAM, Secrets Manager, IRSA (target integration) |

## Application Features

- REST API-based payment service.
- Simulated payment processing endpoint.
- Application health-check endpoint.
- Prometheus-compatible application metrics.
- Docker-based application containerization.
- Kubernetes Deployment with configurable replicas.
- Helm-based application configuration.
- ArgoCD automated synchronization.
- AWS ALB Ingress configuration.

## Application Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Application welcome response |
| GET | `/payment` | Simulates successful payment processing |
| GET | `/health` | Application health status |
| GET | `/metrics` | Exposes Prometheus metrics |

### Sample Payment Response

```json
{
  "status": "success",
  "message": "Payment Processed Successfully"
}
```

**Note:** Payment processing is simulated. No real payment gateway or financial transaction is integrated.

## Repository Structure

```text
EKS-Payment-Service/
│
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
│
├── helm/
│   └── payment-service/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
│
├── argocd-application.yaml
├── payment-service-monitor.yaml
├── secrets-policy.json
│
└── README.md
```

## Docker Containerization

The application is packaged using Docker to ensure consistent execution across development and deployment environments.

### Build Docker Image

```bash
docker build -t payment-service:v1 .
```

### Run Container

```bash
docker run -d -p 5000:5000 payment-service:v1
```

### Verify Application

```bash
curl http://localhost:5000/
curl http://localhost:5000/health
curl http://localhost:5000/payment
curl http://localhost:5000/metrics
```

## Kubernetes Deployment Using Helm

The application is packaged as a Helm chart for reusable and configurable Kubernetes deployment.

### Configuration

The current Helm values include:

- Replica count: 2
- Container port: 5000
- Kubernetes Service type: ClusterIP
- Image repository: Amazon ECR
- Image tag: v1
- Ingress class: ALB

### Validate Helm Chart

```bash
helm lint ./helm/payment-service
```

### Preview Kubernetes Resources

```bash
helm template payment-service ./helm/payment-service
```

### Install Helm Release

```bash
helm install payment-service ./helm/payment-service
```

### Verify Deployment

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

## GitOps Deployment Using ArgoCD

ArgoCD is configured to monitor the GitHub repository and synchronize Kubernetes resources automatically.

### GitOps Workflow

1. Developer pushes configuration changes to GitHub.
2. ArgoCD monitors the configured repository.
3. ArgoCD detects changes in the desired configuration.
4. ArgoCD synchronizes the Kubernetes resources.
5. Kubernetes reconciles the application to the desired state.

### Auto-Sync Configuration

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

- **Auto-Sync:** Automatically applies Git changes.
- **Prune:** Removes resources no longer defined in Git.
- **Self-Heal:** Reconciles supported manual cluster changes.

### Verify ArgoCD Application

```bash
argocd app get payment-service
argocd app sync payment-service
argocd app diff payment-service
```

## AWS Application Load Balancer

The project contains a Kubernetes Ingress resource configured for AWS Application Load Balancer integration.

### Traffic Flow

```text
External Client
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

The Ingress configuration uses:

- Internet-facing ALB.
- IP target mode.
- ALB Ingress class.
- HTTP listener on port 80.

The AWS Load Balancer Controller must be installed and configured in the EKS cluster.

## Monitoring With Prometheus

The Node.js application uses `prom-client` to expose application metrics.

### Custom Metric

```text
payment_requests_total
```

This counter tracks the total number of payment requests handled by the application.

### Metrics Endpoint

```bash
curl http://localhost:5000/metrics
```

A Kubernetes ServiceMonitor is provided to configure Prometheus scraping.

Current scrape configuration:

- Metrics path: `/metrics`
- Scrape interval: 15 seconds
- Application namespace: default

The ServiceMonitor port selector must match a named port in the Kubernetes Service.

## Security – AWS Secrets Manager and IRSA

The target security architecture uses AWS Secrets Manager to store sensitive application credentials.

IRSA (IAM Roles for Service Accounts) provides AWS IAM permissions to Kubernetes workloads without embedding long-lived AWS access keys inside application containers.

### Intended Workflow

```text
AWS Secrets Manager
        |
        v
IAM Role / IRSA
        |
        v
Kubernetes ServiceAccount
        |
        v
Payment Service Pod
```

A complete implementation should include:

- EKS OIDC provider configuration.
- IAM role with least-privilege permissions.
- Kubernetes ServiceAccount annotated with the IAM role ARN.
- Secure secret retrieval or synchronization mechanism.
- Proper secret access restrictions.

## Troubleshooting Commands

### Check Pod Status

```bash
kubectl get pods
kubectl describe pod <pod-name>
```

### View Application Logs

```bash
kubectl logs <pod-name>
kubectl logs -f <pod-name>
```

### Check Deployment

```bash
kubectl get deployments
kubectl rollout status deployment/payment-service
```

### Restart Deployment

```bash
kubectl rollout restart deployment/payment-service
```

### Check Services and Ingress

```bash
kubectl get svc
kubectl get ingress
kubectl describe ingress payment-service
```

### Check ArgoCD

```bash
argocd app get payment-service
argocd app diff payment-service
```

## Key DevOps Concepts Demonstrated

- Containerization using Docker.
- Kubernetes application orchestration.
- Amazon EKS deployment architecture.
- Helm-based Kubernetes configuration.
- GitOps-based continuous delivery.
- ArgoCD automated synchronization.
- AWS Application Load Balancer integration.
- Prometheus application metrics.
- AWS IAM and secure workload identity concepts.

## Future Improvements

- Complete GitHub Actions CI pipeline with secure AWS OIDC authentication.
- Automate Docker image publishing to Amazon ECR.
- Implement automated image tag updates in Git for ArgoCD.
- Integrate AWS Secrets Manager with External Secrets Operator or Secrets Store CSI Driver.
- Configure IRSA with least-privilege IAM policies.
- Configure Grafana dashboards and Prometheus data source.
- Implement HTTPS using ACM certificates.
- Add Kubernetes readiness, liveness and startup probes.
- Configure resource requests, limits and Horizontal Pod Autoscaler.
- Implement payment request validation and real payment gateway integration.

## Author

**Dharshan R**

GitHub: [dharshanworks](https://github.com/dharshanworks)

Project Repository: [EKS-Payment-Service](https://github.com/dharshanworks/EKS-Payment-Service)
