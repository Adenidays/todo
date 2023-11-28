from django.contrib.auth.models import User
from django.db import models



class Task(models.Model):
    title = models.CharField(max_length=255)
    task_text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    create_at = models.DateField(auto_now=True)
    deadline = models.DateField()

    def __str__(self):
        return f'{self.title}____{self.deadline}___{self.pk}'