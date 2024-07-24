import logging

logger = logging.getLogger(__name__)


class ExceptionLoggingMiddleware:
    def resolve(self, next, root, info, **args):
        try:
            return next(root, info, **args)
        except Exception as e:
            raise self._log_exception(e)

    def _log_exception(self, error: Exception) -> Exception:
        logger.exception("Exception caught in resolver.", exc_info=error)

        return error
