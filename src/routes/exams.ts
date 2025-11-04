import { Router } from "express";

const router: Router = Router();

router.get("/1b", async (req, res) => {
  res.send(`
    <pre><code>
Three Machines:

vi /etc/hosts
192.168.6.129 frontend.saec.com frontend
192.168.6.131 kvm2.saec.com kvm2
192.168.6.130 kvm1.saec.com kvm1
esc :wq


On Frontend:

service opennebula start
service opennebula-sunstone start

vi /etc/exports
/var/lib/one/ *(rw,sync,no_subtree_check,no_root_squash,insecure)
esc :wq

exportfs -ra
systemctl start nfs.service
systemctl enable nfs-server.service


Check from kvm1 and kvm2:

showmount -e frontend
systemctl start nfs-client.target
systemctl enable nfs-client.target


On frontend, kvm1 and kvm2:

systemctl | grep -i nfs


On kvm1 and kvm2:

vi /etc/fstab
frontend.saec.com:/var/lib/one/ /var/lib/one/ nfs soft,intr,rsize=8192,wsize=8192 0 0
esc :wq

mount -a -t nfs
df -h /var/lib/one


On Frontend:

su - oneadmin
onehost list
    </code></pre>
  `);
});

router.get("/2b", async (req, res) => {
  res.send(`
    10.0.0.0/24
    10.0.1.0/24
    10.0.2.0/24
    10.0.3.0/24
  `);
});

// Example usage in Express:
router.get("/1a", (req, res) => {
  res.send(`
<pre><code>
EX.NO:1 (b) – Virtualization

Aim:
To execute the procedure for determining how many virtual machines can be utilized at a particular time.


--- LOGIN & INITIAL SETUP ---

Open Frontend, kvm1, kvm2 (Password: redhat)

On FrontEnd:
Right Click → Open in Terminal

[frontend@frontend Desktop]$ su
Password: redhat

[root@frontend Desktop]# su – oneadmin


--- CHECK HOSTS ---

[oneadmin@frontend ~]$ onehost list

ID NAME           CLUSTER RVM ALLOCATED_CPU     ALLOCATED_MEM        STAT
0  kvm1.saec.com  -       0   0 / 100 (0%)       0K / 986.7M (0%)     on
1  kvm2.saec.com  -       0   0 / 100 (0%)       0K / 986.7M (0%)     on
*******************************************************************************


--- CREATE VIRTUAL NETWORK FILE ---

Check your system IP (ipconfig)

[oneadmin@frontend ~]$ vi /var/tmp/mynetwork.one

Insert the following:

NAME = "private"
BRIDGE = br0
AR = [
  TYPE = IP4,
  IP   = 192.168.35.150,
  SIZE = 10
]

(ESC) :wq

[oneadmin@frontend ~]$ onevnet create /var/tmp/mynetwork.one
ID: 1

[oneadmin@frontend ~]$ onevnet list

ID USER     GROUP     NAME     CLUSTER BRIDGE LEASES
1  oneadmin oneadmin  private  -       br0    0


--- CREATE IMAGE ---

Open Browser → http://frontend:9869

Virtual Resources → Images → Add (+)

Name: TTYLinux_1.o
Type: DATABLOCK
Image Location: Empty Datablock
Size: 512
FS: qcow2
Click CREATE

Terminal:
[oneadmin@frontend ~]$ oneimage list

ID USER     GROUP    NAME          DATASTORE SIZE  TYPE PER STAT RVMS
2  oneadmin oneadmin TTYLinux_1.o  default   512M DB   No  rdy   0


--- CREATE TEMPLATE ---

Virtual Resources → Templates → Add (+)

Name: TTYLinux_1.o
VCPU: 1
Click CREATE

Terminal:
[oneadmin@frontend ~]$ onetemplate list

ID USER     GROUP     NAME          REGTIME
2  oneadmin oneadmin  TTYLinux_1.o   08/21 12:38:42


--- INSTANTIATE VIRTUAL MACHINES ---

Virtual Resources → Templates → select TTYLinux_1.o
Click Instantiate

VM Name: kvm1
Click Instantiate again
VM Name: kvm2

Terminal:
[oneadmin@frontend ~]$ onevm list

ID USER     GROUP     NAME   STATU CPU UMEM  HOST             TIME
3  oneadmin oneadmin  kvm1   runn  2   512M  kvm2.saec.com     0d 00h01
2  oneadmin oneadmin  kvm2   runn  2   512M  kvm1.saec.com     0d 00h02


--- LIVE MIGRATION ---

Browser: Virtual Resources → Virtual Machine → oneadmin → Migrate (live)

Select Host → Migrate

Terminal:
[oneadmin@frontend ~]$ onevm migrate --live TTYLinux_1-2 kvm1.cni.com

[oneadmin@frontend ~]$ onevm list

ID USER     GROUP     NAME           STAT UCPU UMEM HOST         TIME
2  oneadmin oneadmin  TTYLinux_1-2   runn 24   256M kvm1.cni.com 0d 00h13


RESULT:
Successfully executed virtualization and verified how many virtual machines can be utilized at a particular time.
</code></pre>
  `);
});

export default router;
