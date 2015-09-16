<?php if (!isMobile()) : ?>
	<div class="site-info__preview-img__wrapper">
		<div class="site-info__preview-img__item site-info__preview-img__desktop">
			<span class="site-info__preview-img__item-bg site-info__preview-img__desktop_bg">
				<div class="site-info__preview-img__bg-header"><?php svg('comments-o', 20, null, 'white'); ?></div>
				<?php svg('user', 45, null, '#ccc'); ?>
				<div class="site-info__preview-img__bg-bar"></div>
				<div class="site-info__preview-img__bg-bar"></div>
			</span>
			<?php svg('desktop', 280, 300, '#999'); ?>
		</div>
		<div class="site-info__preview-img__item site-info__preview-img__tablet">
			<span class="site-info__preview-img__item-bg site-info__preview-img__tablet_bg">
				<div class="site-info__preview-img__bg-header"><?php svg('comments-o', 15, null, 'white'); ?></div>
				<?php svg('user', 35, null, '#bbb'); ?>
				<div class="site-info__preview-img__bg-bar"></div>
				<div class="site-info__preview-img__bg-bar"></div>
			</span>
			<span class="site-info__preview-img__tablet-svg-wrapper">
				<?php svg('tablet', 200, null, '#999'); ?>
			</span>
		</div>
		<div class="site-info__preview-img__item site-info__preview-img__mobile">
			<span class="site-info__preview-img__item-bg site-info__preview-img__mobile_bg">
				<div class="site-info__preview-img__bg-header"></div>
				<?php svg('user', 10, null, '#aaa'); ?>
				<div class="site-info__preview-img__bg-bar"></div>
			</span>
			<span class="site-info__preview-img___mobile-svg-wrapper">
				<?php svg('mobile', 100, null, '#999'); ?>
			</span>
		</div>
	</div>

	<div class="jumbotron site-info__jumbotron" style="xbackground-color: #d9edf7;">
		<div class="site-info__details-wrapper">
			<div class="page-header">
			  <h1>Coach Tracker <small>case note taking solution</small></h1>
			</div>
			<div class="row">
				<div class="col-sm-4">
					<div class="site-info__info-col">
						<?php svg('quote-left', 15, null, '#999'); ?>								
						Provides unencumbered note taking; including mobile device accessibility with simplified data entry requirements.
						<?php svg('quote-right', 15, null, '#999'); ?>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="site-info__info-col ">
						<?php svg('quote-left', 15, null, '#999'); ?>								
						Provides a format for note-taking that will directly support the service providers who are charged with taking case notes by coupling quick access to case note history and caseload contact information.							
						<?php svg('quote-right', 15, null, '#999'); ?>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="site-info__info-col ">
						<?php svg('quote-left', 15, null, '#999'); ?>
						Provides a casenote database accessibility to support participant individuals with multiple and diverse service providers							
						<?php svg('quote-right', 15, null, '#999'); ?>
					</div>
				</div>					
			</div>
		</div>
	</div>
	<?php if(0) : ?>
		<div class="site-info__learn-more">
			<button type="button" class="btn btn-lg btn-success site-info__learn-more--btn">
				<span class="site-info__learn-more--btn-text">Learn More</span>
				<?php svg('angle-right', 20, null, 'white'); ?>
			</button>
		</div>
		<div class="pricing hidden">
			<div class="row">
				<div class="col-sm-4">
					<div class="panel panel-default pricing__panel">
						<div class="panel-heading pricing__panel-head">
							<span>Standard</span>
							<div class="pricing__panel-head--price">$2,500 <small>annually</small></div>
						</div>
						<div class="panel-body">
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								1 Admin
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								5 Coaches
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								100 Students
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Unlimited Data Exports
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="panel panel-default pricing__panel">
						<div class="panel-heading pricing__panel-head">
							<span>Professional</span>
							<div class="pricing__panel-head--price">$5,000 <small>annually</small></div>
						</div>
						<div class="panel-body">
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								3 Admins
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								25 Coaches
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								500 Students
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Unlimited Data Exports
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Onsite Training
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-4">
					<div class="panel panel-default pricing__panel">
						<div class="panel-heading pricing__panel-head">
							<span>Enterprise</span>
							<div class="pricing__panel-head--price">$10,000 <small>annually</small></div>
						</div>
						<div class="panel-body">
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								5 Admin
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								100 Coaches
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								2500 Students
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Unlimited Data Exports
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Onsite Training
							</div>
							<div class="pricing__panel-includes">
								<?php svg('check', 20, null, '#5cb85c'); ?>
								Customizable Features
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	<?php endif; ?>
<?php endif; ?>