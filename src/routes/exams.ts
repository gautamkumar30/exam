import { Router } from "express";

const router: Router = Router();

router.get("/1b", async (req, res) => {
  res.send(`
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
  `);
});

export default router;
