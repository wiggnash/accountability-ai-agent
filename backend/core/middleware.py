import threading
from django.utils.deprecation import MiddlewareMixin

# Thread-local storage to store the current user
_thread_locals = threading.local()


class AuditMiddleware(MiddlewareMixin):
    """
    Middleware to capture the current user for audit fields
    """

    def process_request(self, request):
        """
        Store the current user in thread-local storage
        """
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            set_current_user(user)
        else:
            set_current_user(None)
        return None

    def process_response(self, request, response):
        """
        Clean up thread-local storage
        """
        set_current_user(None)
        return response


def get_current_user():
    """
    Get the current user from thread-local storage
    """
    return getattr(_thread_locals, 'user', None)


def set_current_user(user):
    """
    Set the current user in thread-local storage
    """
    _thread_locals.user = user
