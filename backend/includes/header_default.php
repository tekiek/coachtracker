
<?php #if (loginStatus()) : ?>
	<div data-category="" class="left logo-wrapper text-shadow">
		<span class="header__logo-icon"><?php svg('comments-o', null, null, 'white'); ?></span>
	</div>
	<?php if (!isMobile()) : ?>
		<div class="animated header__sign-up-btn acl-loggedOut">Login</div>
	<?php endif; ?>
<?php #endif; ?>