# WIK-DPS-TP04 | Introduction à Kubernetes
----------------------------------------------
### **Pour chaque étape il faut produire les fichiers YAML nécessaires et les conserver pour les communiquer lors du rendu.**
--------------------------------------------

# Sommaire

- [1. Créer un Pod pour déployer l'image registry.cluster.wik.cloud/public/echo](#1-créer-un-pod-pour-déployer-limage-registryclusterwikcloudpublicecho-cest-limage-créée-lors-du-tp-wik-dps-tp02-et-le-tester-sur-minikube-en-local)
- [2. Remplacer le Pod par un ReplicaSet afin de déployer 4 réplicas du Pod créé précédemment](#2-remplacer-le-pod-par-un-replicaset-afin-de-déployer-4-réplicas-du-pod-créé-précédemment)
- [3. Remplacer le ReplicaSet par un Deployment afin de pouvoir définir une stratégie d'update en RollingUpdate](#3-remplacer-le-replicaset-par-un-deployment-afin-de-pouvoir-définir-une-stratégie-dupdate-en-rollingupdate-50-en-maxunavailable)
- [4. Créer un Service pour pouvoir communiquer avec les Pod du ReplicaSet créé précédemment](#4-créer-un-service-pour-pouvoir-communiquer-avec-les-pod-du-replicaset-créé-précédemment)
- [5. Activer le plugin ingress nginx sur minikube et créer un Ingress (nom de domaine au choix) pour communiquer avec le Service créé précédemment.](#5-activer-le-plugin-ingress-nginx-sur-minikube-et-créer-un-ingress-nom-de-domaine-au-choix-pour-communiquer-avec-le-service-créé-précédemment)
- [6. Tester en ajoutant le nom de domaine choisi dans /etc/hosts afin de résoudre localement vers le service nginx de minikube](#6-tester-en-ajoutant-le-nom-de-domaine-choisi-dans-etchosts-afin-de-résoudre-localement-vers-le-service-nginx-de-minikube)
- [7. Faites une capture d'écran de la page sur votre navigateur avec le nom de domaine de votre choix pour votre service](#7-faites-une-capture-décran-de-la-page-sur-votre-navigateur-avec-le-nom-de-domaine-de-votre-choix-pour-votre-service)

## **Créer un Pod pour déployer l'image registry.cluster.wik.cloud/public/echo (c'est l'image créée lors du TP WIK-DPS-TP02) et le tester sur minikube en local.**
- **Voir le fichier :file_folder: [`pod.yaml`](pod.yaml)**
- **Pour éxécuter le fichier pour lancer et tester ce pod :**
 ```
 PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl apply -f pod.yaml --> Créé la ressource (le pod) à partir du fichier (-f) pod.yaml
 pod/part-01-pod created
 PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl get pod --> Vérifier si le pod est actif
 ```
 
### **Pour le tester vous devez faire un port-forwarding entre le port du Pod sur lequel votre API écoute et un port sur votre hôte.**

- **Pour lancer le port-forwarding :** `kubectl port-forward part-01-pod 8080:8080`
- **Résultat `localhost:8080/ping` :**
![](https://i.imgur.com/vuUrrj0.png)

- **Pour delete ce pod : `kubectl delete pod part-01-pod`**
----------------------------------------------------
## **Remplacer le Pod par un ReplicaSet afin de déployer 4 réplicas du Pod créé précédemment.**

L'objectif ici est de faire en sorte que notre pod soit répliqué 4fois.

1. **Créer un fichier :file_folder: [replicaset.yaml](replicaset.yaml)**
2. **Exécuter le fichier replica :**
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl apply -f replicaset.yaml
replicaset.apps/part-2-service created
service/replica-set-service created
```
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl get pods
NAME                   READY   STATUS    RESTARTS   AGE
part-2-service-c2jrb   1/1     Running   0          6s
part-2-service-j57wg   1/1     Running   0          6s
part-2-service-rpmjx   1/1     Running   0          6s
part-2-service-v6lck   1/1     Running   0          6s
```
3. **Lancer le port-forwarding :**
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl port-forward replicaset.apps/part-2-service 8080:8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Handling connection for 8080
```


![](https://i.imgur.com/yPl1BPy.png)

- **Pour delete le replicaset :**
```
kubectl delete replicaset.apps/part-2-service
```
----------------------------------------------------
## **Remplacer le ReplicaSet par un Deployment afin de pouvoir définir une stratégie d'update en RollingRelease (50% en maxUnavailable).**
1. **Créer un fichier :file_folder: [`deployment.yaml`](deployment.yaml)**
2. **Exécuter le fichier de deployment :**
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl apply -f deployment.yaml
deployment.apps/part-3-deployment created
service/deployment-service created
```
3. **Vérifier les services actifs :**
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl get services
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
deployment-service    ClusterIP   10.107.146.179   <none>        80/TCP    28s
kubernetes            ClusterIP   10.96.0.1        <none>        443/TCP   4h36m
replica-set-service   ClusterIP   10.101.13.72     <none>        80/TCP    68m
```
4. **Lancer le port-forwarding :**
```
PS C:\Users\yrlan\OneDrive - Ynov\B3\DevOps\TP's DevOps B3\WIK-DPS-TP04> kubectl port-forward deployment.apps/part-3-deployment 8080:8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
Handling connection for 8080
```

- **Pour delete le deployment**
----------------------------------------------------
## **Créer un Service pour pouvoir communiquer avec les Pod du ReplicaSet créé précédemment, pour le tester vous devez faire un port-forwarding entre le port du Service sur lequel votre API écoute et un port sur votre hôte.**
1. **Créer un fichier :file_folder: [service.yaml](service.yaml)**
2. **Activer le plugin ingress nginx sur minikube et créer un Ingress (nom de domaine au choix) pour communiquer avec le Service créé précédemment.**

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-ingress-service-part-04
spec:
  rules:
    - host: yrlan.com
      http:
        paths:
          - path: /ping
            pathType: Prefix
            backend:
              service:
                name: service-ingress-service-part-04
                port:
                  number: 8080
```

3. **Tester en ajoutant le nom de domaine choisi dans /etc/hosts afin de résoudre localement vers le service nginx de minikube.**

- **Il faut se rendre, sur Windows, dans :**
`C:\Windows\System32\drivers\etc\host`
afin de rajouter une ligne à ce fichier, dans notre cas :
```
127.0.0.1 yrlan.com
```

4. **Vous pouvez alors accéder via votre navigateur au service créé précédemment Faites une capture d'écran de la page sur votre navigateur avec le nom de domaine de votre choix pour votre service.**

## Exécution du service (fichier .yaml final) : 

Exécuter le fichier :file:folder: service.yaml pour démarrer le service :
```
kubectl apply -f service.yaml
```
Pour stopper le service :
```
kubectl delete deployment.apps/service-service-part-04
```

Pour voir les services, le réseau sur lequel ils tournent etcc..
```
kubectl get pods,services,deployments,ingress.networking.k8s.io
```