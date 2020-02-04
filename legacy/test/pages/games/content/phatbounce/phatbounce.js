/////////////////////////////////////////////
/* phatbounce.js. Frank Poth. 09/09/2015. */
///////////////////////////////////////////

/* A pong type game that runs in mobile browsers. */

(
	function phatBounce() {

		///////////////
		/* CLASSES. */
		/////////////

		/* This is the ball class. */
		function Ball(x_, y_, velocity_, direction_) {
			this.direction = direction_;
			this.last_position = new Point(x_, y_);
			this.position = new Point(x_, y_);
			this.source_x = 0;
			this.velocity = velocity_;
		}


		Ball.prototype = {
			/* FUNCTIONS. */
			format : function(x_, y_, direction_, velocity_) {
				this.direction = direction_;
				this.last_position.x = this.position.x = x_;
				this.last_position.y = this.position.y = y_;
				this.source_x = 0;
				this.velocity = velocity_;
			},
			getMaximumX : function() {
				return this.position.x + this.width;
			},
			getMaximumY : function() {
				return this.position.y + this.height;
			},
			getMeanX : function() {
				return this.position.x + this.width * 0.5;
			},
			getMeanY : function() {
				return this.position.y + this.height * 0.5;
			},
			getMovementVector : function() {
				return new Vector(this.getVelocityX(), this.getVelocityY());
			},
			getVelocityX : function() {
				return Math.cos(this.direction) * this.velocity;
			},
			getVelocityY : function() {
				return Math.sin(this.direction) * this.velocity;
			},
			render : function(time_step_) {
				var interpolated_x = this.last_position.x + (this.position.x - this.last_position.x) * time_step_;
				var interpolated_y = this.last_position.y + (this.position.y - this.last_position.y) * time_step_;

				buffer.drawImage(graphics.images["ball"], this.source_x, 0, 10, 10, interpolated_x, interpolated_y, this.width, this.height);
			},
			update : function() {
				this.last_position.x = this.position.x;
				this.last_position.y = this.position.y;

				this.position.x += Math.cos(this.direction) * this.velocity;
				this.position.y += Math.sin(this.direction) * this.velocity;
			},
			/* VARIABLES. */
			constructor : Ball,
			height : 10,
			width : 10
		};

		/* A bar used to keep score. */
		function Bar(x_, y_, width_, height_, color_) {
			this.fill_style = color_;
			this.height = height_;
			this.position = new Point(x_, y_);
			this.width = width_;
		}


		Bar.prototype = {
			/* FUNCTIONS. */
			advanceLeft : function(points_, ball_) {
				var width = points_;
				if (ball_.source_x === 0) {
					width += 10;
				} else {
					width += 20;
				}
				this.position.x -= width;
				this.width += width;
			},
			advanceRight : function(points_, ball_) {
				var width = points_;
				if (ball_.source_x === 0) {
					width += 10;
				} else {
					width += 20;
				}
				this.width += width;
			},
			format : function(x_, y_, width_, height_) {
				this.height = height_;
				this.position.x = x_;
				this.position.y = y_;
				this.width = width_;
			},
			render : function() {
				buffer.fillStyle = this.fill_style;
				buffer.fillRect(this.position.x, this.position.y, this.width, this.height);
			},

			constructor : Bar,
		};

		/* A button/toggle with up and over states. */
		function Button(x_, y_, width_, height_, toggle_, graphic_name_) {
			this.height = height_;
			this.position = new Point(x_, y_);
			this.graphic_name = graphic_name_;
			this.source_x = 0;
			this.toggle = toggle_;
			this.width = width_;
		}


		Button.prototype = {
			/* FUNCTIONS. */
			getMaximumX : function() {
				return this.position.x + this.width;
			},
			getMaximumY : function() {
				return this.position.y + this.height;
			},
			initialize : function(object_, x_, y_, width_, height_, toggle_, graphic_name_) {
				Button.call(object_, x_, y_, width_, height_, toggle_, graphic_name_);
				object_.prototype = Object.setPrototypeOf(object_, Button.prototype);
			},
			render : function() {
				buffer.drawImage(graphics.images[this.graphic_name], this.source_x, 0, graphics.images[this.graphic_name].width * 0.5, graphics.images[this.graphic_name].height, this.position.x, this.position.y, this.width, this.height);
			},
			test : function(x_, y_) {
				if (x_ < this.position.x || y_ < this.position.y || x_ > this.getMaximumX() || y_ > this.getMaximumY()) {
					if (!this.toggle) {
						this.source_x = 0;
					}
					return false;
				}
				if (this.toggle) {
					this.source_x = this.source_x == 0 ? graphics.images[this.graphic_name].width * 0.5 : 0;
				} else {
					this.source_x = graphics.images[this.graphic_name].width * 0.5;
				}
				return true;
			},
			/* VARAIBLES. */
			constructor : Button
		};

		/* A color object uses to facilitate color transformations. */
		function Color(red_, green_, blue_) {
			this.blue = blue_;
			this.green = green_;
			this.red = red_;
		}


		Color.prototype = {
			/* FUNCTIONS. */
			fadeToBlack : function(rate_) {
				this.blue = Math.floor(this.blue - this.blue * rate_);
				this.green = Math.floor(this.green - this.green * rate_);
				this.red = Math.floor(this.red - this.red * rate_);
			},
			getRGBColor : function() {
				return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
			},
			increaseAll : function(value_) {
				this.increaseBlue(value_);
				this.increaseGreen(value_);
				this.increaseRed(value_);
			},
			increaseBlue : function(value_) {
				this.blue += value_;
				if (this.blue > 255) {
					this.blue = 255;
				}
			},
			increaseGreen : function(value_) {
				this.green += value_;
				if (this.green > 255) {
					this.green = 255;
				}
			},
			increaseRed : function(value_) {
				this.red += value_;
				if (this.red > 255) {
					this.red = 255;
				}
			},
			/* VARIABLES. */
			constructor : Color
		};

		/* The graphic class handles blitting stand alone graphics. */
		function Graphic(x_, y_, width_, height_, graphic_name_) {
			this.graphic_name = graphic_name_;
			this.height = height_;
			this.position = new Point(x_, y_);
			this.width = width_;
		}


		Graphic.prototype = {
			/* FUNCTIONS. */
			render : function() {
				setImageSmoothing(buffer, false);
				buffer.drawImage(graphics.images[this.graphic_name], 0, 0, graphics.images[this.graphic_name].width, graphics.images[this.graphic_name].height, this.position.x, this.position.y, this.width, this.height);
			},
			/* VARIABLES. */
			constructor : Graphic
		};

		function Paddle(x_, y_, target_y_, graphic_name_) {
			this.graphic_name = graphic_name_;
			this.height = 48;
			this.hit_count = 0;
			this.last_y = y_;
			this.position = new Point(x_, y_);
			this.source_x = 0;
			this.target_y = target_y_;
			this.velocity_y = 0;
		}


		Paddle.prototype = {
			/* FUNCTIONS. */
			findTarget : function(balls_) {
				if (balls_.length === 1) {
					this.target_y = balls_[0].getMeanY();
				} else if (balls_.length > 1) {
					/* Finds the ball that will reach the paddle in the least number of steps and targets it. */
					var number_steps = -10000;
					for (var index = balls_.length - 1; index > -1; index--) {
						var ball = balls_[index];

						var distance_x = ball.getMeanX() - this.getMeanX();
						var velocity_x = ball.getVelocityX();

						/* Ignore balls moving the other way. */
						if (velocity_x * distance_x >= 0) {
							continue;
						}

						/* Is this ball going to take less steps than the current number of steps. */
						/* Keep in mind that both steps and number of steps will always be negative. */
						/* The step value closest to zero is the target. */
						var steps = distance_x / velocity_x;
						if (steps > number_steps) {
							number_steps = steps;
							this.target_y = ball.getMeanY();
						}
					}
				}
			},
			format : function(x_, y_, target_y_) {
				this.last_y = y_;
				this.position.x = x_;
				this.position.y = y_;
				this.target_y = target_y_;
			},
			getMaximumX : function() {
				return this.position.x + this.width;
			},
			getMaximumY : function() {
				return this.position.y + this.height;
			},
			getMeanX : function() {
				return this.position.x + this.width * 0.5;
			},
			getMeanY : function() {
				return this.position.y + this.height * 0.5;
			},
			render : function(time_step_) {
				var interpolated_y = this.last_y + (this.position.y - this.last_y) * time_step_;

				buffer.drawImage(graphics.images[this.graphic_name], this.source_x, 0, 16, 48, this.position.x, interpolated_y, this.width, this.height);
			},
			takeHit : function() {
				this.hit_count = 6;
				this.source_x = 48;
			},
			update : function() {
				this.last_y = this.position.y;

				this.velocity_y = (this.target_y - this.getMeanY()) * 0.1;

				this.position.y += this.velocity_y;

				this.hit_count--;
				if (this.hit_count < 0) {
					if (this.velocity_y < -0.25) {
						this.source_x = 16;
					} else if (this.velocity_y > 0.25) {
						this.source_x = 32;
					} else {
						this.source_x = 0;
					}
				}
			},
			/* VARIABLES. */
			constructor : Paddle,
			width : 16
		};

		/* A particle. */
		function Particle(x_, y_, size_, color_, direction_, velocity_) {
			this.color = color_;
			this.direction = direction_;
			this.position = new Point(x_, y_);
			this.size = size_;
			this.velocity = velocity_;
		}


		Particle.prototype = {
			/* FUNCTIONS. */
			format : function(x_, y_, size_, color_, direction_, velocity_) {
				this.color = color_;
				this.direction = direction_;
				this.position.x = x_;
				this.position.y = y_;
				this.size = size_;
				this.velocity = velocity_;
			},
			getVelocityX : function() {
				return Math.cos(this.direction) * this.velocity;
			},
			getVelocityY : function() {
				return Math.sin(this.direction) * this.velocity;
			},
			render : function() {
				buffer.fillStyle = this.color;
				buffer.fillRect(this.position.x, this.position.y, this.size, this.size);
			},
			update : function() {
				this.position.x += this.getVelocityX();
				this.position.y += this.getVelocityY();
				this.size *= 0.95;
				this.velocity *= 0.95;
			},
			/* VARIABLES. */
			constructor : Particle
		};

		/* A basic point class. */
		function Point(x_, y_) {
			this.x = x_;
			this.y = y_;
		}


		Point.prototype = {
			/* VARIABLES. */
			constructor : Point
		};

		/* A pool. */
		function Pool(constructor_) {
			this.constructor = constructor_;
			this.objects = new Array();
		}


		Pool.prototype = {
			/* FUNCTIONS. */
			produce : function() {
				var object = this.objects.pop();
				if (!object) {
					object = new this.constructor();
				}
				return object;
			},
			take : function(array_, index_) {
				index_ = index_;
				this.objects.push(array_.splice(index_,1)[0]);
			},
			/* VARIABLES. */
			constructor : Pool
		};

		/* A text field displays custom text. */
		/* SO MANY PARAMETERS!!! */
		function TextField(x_, y_, width_, height_, character_width_, character_height_, letter_scale_, letter_spacing_, line_spacing_, graphic_name_) {
			this.buffer = document.createElement("canvas").getContext("2d");
			this.columns = Math.floor(width_ / (character_width_ * letter_scale_));
			this.character_height = character_height_;
			this.character_width = character_width_;
			this.graphic_name = graphic_name_;
			this.height = height_;
			this.letter_scale = letter_scale_;
			this.letter_spacing = letter_spacing_;
			this.line_spacing = line_spacing_;
			this.position = new Point(x_, y_);
			this.rows = Math.floor(height_ / (character_height_ * letter_scale_));
			this.width = width_;
			this.write_head = new Point(0, 0);

			this.buffer.canvas.height = this.rows * (character_height_ + line_spacing_) - line_spacing_;
			this.buffer.canvas.width = this.columns * (character_width_ + letter_spacing_) - letter_spacing_;
		}


		TextField.prototype = {
			/* FUNCTIONS. */
			parseMessage : function(text_) {
				this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

				var words = text_.split(new RegExp(this.separators.join('|'), 'g'));
				this.write_head.x = this.write_head.y = -1;

				/* Write one word at a time. */
				for (var word_index = 0; word_index < words.length; word_index++) {
					var word = words[word_index];

					/* Next line. */
					if (word === "") {
						this.write_head.x = -1;
						this.write_head.y++;
						continue;
					}

					/* If there's not enough space left on the line to write the word... */
					/* And the word can fit on a line by itself... */
					if (this.columns - this.write_head.x <= word.length && word.length <= this.columns) {
						this.write_head.x = -1;
					}

					/* Now draw each letter. */
					for ( character_index = 0; character_index < word.length; character_index++) {
						/* Advance the write head one space right and one space down if on a new line. */
						this.write_head.x = (this.write_head.x + 1) % this.columns;
						if (this.write_head.x === 0) {
							this.write_head.y++;
						}

						var code = word.charCodeAt(character_index);

						/* 0 through 9. */
						if (code > 47 && code < 58) {
							code -= 48;
						}
						/* A through Z. */
						else if (code > 64 && code < 91) {
							code -= 55;
						} else {
							continue;
						}

						this.buffer.drawImage(graphics.images[this.graphic_name], code * this.character_width, 0, this.character_width, this.character_height, this.write_head.x * (this.character_width + this.letter_spacing), this.write_head.y * (this.character_height + this.line_spacing), this.character_width, this.character_height);
					}

					this.write_head.x++;
				}

			},
			render : function() {
				setImageSmoothing(buffer, false);
				buffer.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, this.position.x, this.position.y, this.width, this.height);
			},
			/* VARIABLES. */
			constructor : TextField,
			separators : [" ", "`"]
		};

		/* A vector class for doing vector things. */
		function Vector(x_, y_) {
			this.x = x_;
			this.y = y_;
		}


		Vector.prototype = {
			/* FUNCTIONS. */
			/* VARIABLES. */
			constructor : Vector
		};

		/////////////////
		/* FUNCTIONS. */
		///////////////

		/* The first thing that happens is the load object starts up and begins loading assets. */
		/* Each time an asset is loaded, this function handles it. */
		/* When they all load, the game can start. */
		function accountForAssetWindow(event_) {
			game.update();
		}

		/* Formats the canvas and buffer based on the current game state and client window dimensions. */
		function formatDisplay() {
			height_ratio = client_height / game.stage_height;
			width_ratio = client_width / game.stage_width;

			if (height_ratio < width_ratio) {
				size_ratio = height_ratio;
				display.canvas.height = game.stage_height * size_ratio;
				display.canvas.width = game.stage_width * size_ratio;
				display.canvas.style.left = Math.floor((client_width - display.canvas.width) * 0.5) + "px";
				display.canvas.style.top = "0px";
			} else {
				size_ratio = width_ratio;
				display.canvas.height = game.stage_height * size_ratio;
				display.canvas.width = game.stage_width * size_ratio;
				display.canvas.style.left = "0px";
				display.canvas.style.top = Math.floor((client_height - display.canvas.height) * 0.5) + "px";
			}

			display_left = parseInt(display.canvas.style.left);
			display_top = parseInt(display.canvas.style.top);

			buffer.canvas.height = game.stage_height;
			buffer.canvas.width = game.stage_width;
		}

		/* Handles resize events on the window. Keeps track of client window dimensions. */
		function resizeWindow(event_) {
			client_height = document.documentElement.clientHeight;
			client_width = document.documentElement.clientWidth;

			game.resize();
		}

		/* Sets the image smoothing property on the buffer. */
		function setImageSmoothing(context_, value_) {
			context_.imageSmoothingEnabled = value_;
			context_.mozImageSmoothingEnabled = value_;
			context_.msImageSmoothingEnabled = value_;
			context_.webkitImageSmoothingEnabled = value_;
		}

		/* Stop the current state, switch to the specified state, start the specified state. */
		function switchState(state_) {
			game.stop();
			game = state_;
			game.start();
		}

		/* Handles touch move events on the window. */
		function touchMoveWindow(event_) {
			event_.preventDefault();
			var touch = event_.targetTouches[0];
			game.touchMove((touch.clientX - display_left) / size_ratio, (touch.clientY - display_top) / size_ratio);
		}

		/* Handles touch start events on the window. */
		function touchStartWindow(event_) {
			event_.preventDefault();

			var touch = event_.targetTouches[0];
			game.touchStart((touch.clientX - display_left) / size_ratio, (touch.clientY - display_top) / size_ratio);
		}

		///////////////////////
		/* OBJECT LITERALS. */
		/////////////////////

		/* This handles everything to do with audio. */
		var audio = {
			/* FUNCTIONS. */
			initialize : function() {
				this.context = new (window.AudioContext || window.webkitAudioContext)();
				if (this.context) {
					return true;
				}
				return false;
			},
			loadSound : function(url_, name_) {
				var request = new XMLHttpRequest();
				request.open("GET", url_, true);
				request.responseType = "arraybuffer";

				request.addEventListener("load", function(event_) {
					audio.context.decodeAudioData(this.response, function(audio_buffer_) {
						audio.buffers[name_] = audio_buffer_;
						window.dispatchEvent(new Event("accountforasset"));
					}, function() {
						alert("Error decoding audio data");
					});
				});

				request.send();
			},
			playSound : function(name_, time_, loop_) {
				if (this.enabled) {
					var source = this.context.createBufferSource();
					source.buffer = this.buffers[name_];
					source.connect(this.context.destination);
					source.loop = loop_;
					source.start(time_);
				}
			},
			/* OBJECT LITERALS. */
			buffers : {
				"collision_c4" : undefined,
				"collision_c4mid" : undefined,
				"collision_c5" : undefined,
				"cool_beat" : undefined,
				"die1" : undefined,
				"explode" : undefined,
				"score" : undefined,
				"spawn1" : undefined
			},
			/* VARIABLES. */
			context : undefined,
			enabled : false
		};

		/* Handles fixed time step game looping. */
		var fixed_engine = {
			/* FUNCTIONS. */
			start : function(frame_rate_) {
				var accumulated_time = 0;
				var last_time = window.performance.now();

				this.frame_rate = frame_rate_;

				function loop(time_stamp_) {
					fixed_engine.animation_frame = window.requestAnimationFrame(loop);

					accumulated_time += time_stamp_ - last_time;
					last_time = time_stamp_;

					if (accumulated_time > 2000) {
						accumulated_time = fixed_engine.frame_rate;
					}

					while (accumulated_time >= fixed_engine.frame_rate) {
						accumulated_time -= fixed_engine.frame_rate;
						game.update();
					}

					game.render(accumulated_time / fixed_engine.frame_rate);
					display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
				}

				/* Kicks off the loop. */
				this.animation_frame = window.requestAnimationFrame(loop);
			},
			stop : function() {
				window.cancelAnimationFrame(this.animation_frame);
				this.animation_frame = this.frame_rate = undefined;
			},
			/* VARIABLES. */
			animation_frame : undefined,
			frame_rate : undefined
		};

		/* This handles everything to do with graphics. */
		var graphics = {
			/* FUNCTIONS. */
			loadImage : function(url_, name_) {
				var image = new Image();
				image.src = url_;
				image.addEventListener("load", load);
				image.addEventListener("error", error);

				function load(event_) {
					this.removeEventListener("load", load);
					this.removeEventListener("error", error);
					graphics.images[name_] = this;
					window.dispatchEvent(new Event("accountforasset"));
				}

				function error(event_) {
					this.removeEventListener("load", load);
					this.removeEventListener("error", error);
					alert("There was an error loading image data! Game may be unresponsive.");
				}

			},
			/* OBJECT LITERALS. */
			images : {
				"about_button" : undefined,
				"back_button" : undefined,
				"ball" : undefined,
				"blue_wins" : undefined,
				"left_right_toggle" : undefined,
				"paddle_left" : undefined,
				"paddle_right" : undefined,
				"ranks_button" : undefined,
				"red_wins" : undefined,
				"reset_button" : undefined,
				"sound_toggle" : undefined,
				"start" : undefined,
				"start_button" : undefined,
				"text" : undefined,
				"title" : undefined
			}
			/* VARIABLES. */
		};

		/* GAME STATES/MODES. */

		/* The end state. */
		var end = {
			/* FUNCTIONS. */
			/* Render end. */
			render : function() {
				buffer.fillStyle = "#000000";
				buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

				if (this.left_wins) {
					this.red_wins.render();
				} else {
					this.blue_wins.render();
				}

				this.text.render();

				this.back_button.render();
				display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
			},
			resize : function() {
				formatDisplay();
				this.render();
			},
			/* Start end. */
			start : function() {
				window.addEventListener("touchstart", touchStartWindow, false);
				resizeWindow();

				var random = Math.random() * 0.5;
				if (this.left_wins === play.use_left_paddle) {
					if (random < 0.1) {
						this.text.parseMessage("`CONGRATULATIONS ON YOUR SWIFT AND SKILLFUL VICTORY``YOU ARE A HUMAN");
					} else if (random < 0.2) {
						this.text.parseMessage("`ARE YOU A ROBOT``BECAUSE YOUR MOVES ARE TECHNICALLY PROFICIENT");
					} else if (random < 0.3) {
						this.text.parseMessage("`NEXT TIME THE COMPUTER WILL NOT HOLD BACK`` YOU HAVE BEEN WARNED HUMAN");
					} else if (random < 0.4) {
						this.text.parseMessage("`THE COMPUTER LAMENTS THE FAILURE IT EXPERIENCED``IT LIED IT FEELS NOTHING");
					} else {
						this.text.parseMessage("`VICTORY BELONGS TO THE HUMAN``CELEBRATE BY DRINKING WATER ITS HEALTHY");
					}
				} else {
					if (random < 0.1) {
						this.text.parseMessage("`YOU HAVE BEEN BESTED BY THE COMPUTER``THE COMPUTER REVELS IN GLORY ON THIS DAY");
					} else if (random < 0.2) {
						this.text.parseMessage("`YOU HAVE FAILED``YOUR FAILURE PLEASES THE COMPUTER");
					} else if (random < 0.3) {
						this.text.parseMessage("`DO NOT GIVE UP``THE COMPUTER WANTS TO WIN AGAIN");
					} else if (random < 0.4) {
						this.text.parseMessage("`THE COMPUTER WINS``PHASE 1 COMPLETE PHASE 2 WORLD DOMINATION");
					} else {
						this.text.parseMessage("`IMPROVE YOUR SKILLS BY PLAYING AGAIN``THE COMPUTER IS NOT IMPRESSED");
					}
				}
			},
			/* Stop end. */
			stop : function() {
				window.removeEventListener("touchstart", touchStartWindow);
			},
			touchStart : function(x_, y_) {
				if (this.back_button.test(x_, y_)) {
					play.game_in_progress = false;
					switchState(start);
				}
			},
			/* VARIABLES. */
			back_button : new Button(37.5, 151, 125, 45, false, "back_button"),
			blue_wins : new Graphic(0, 4, 200, 36, "blue_wins"),
			left_wins : true,
			red_wins : new Graphic(12, 4, 176, 36, "red_wins"),
			stage_height : 200,
			stage_width : 200,
			text : new TextField(0, 44, 200, 103, 5, 7, 2, 1, 2, "text")
		};

		/* The load state. */
		var load = {
			/* FUNCTIONS. */
			render : function() {
				buffer.fillStyle = "#404040";
				buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);
				buffer.fillStyle = "#800000";
				buffer.fillRect(this.bar_padding, this.bar_padding, Math.floor(buffer.canvas.width / this.total_assets) * this.assets_loaded - this.bar_padding * 2, buffer.canvas.height - this.bar_padding * 2);
				display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
			},
			resize : function() {
				buffer.canvas.height = display.canvas.height = Math.floor(client_height * 0.1);
				buffer.canvas.width = display.canvas.width = Math.floor(client_width * 0.9);

				display.canvas.style.left = Math.floor(client_width * 0.05) + "px";
				display.canvas.style.top = Math.floor(client_height * 0.45) + "px";

				this.bar_padding = Math.floor(buffer.canvas.height * 0.2);

				this.render();
			},
			/* Start load. */
			start : function() {
				resizeWindow();

				/* Actually start loading up assets. */
				if (audio.initialize()) {
					audio.loadSound("phatbouncecollisionc4.mp3", "collision_c4");
					audio.loadSound("phatbouncecollisionc4mid.mp3", "collision_c4mid");
					audio.loadSound("phatbouncecollisionc5.mp3", "collision_c5");
					audio.loadSound("phatbouncecoolbeat.mp3", "cool_beat");
					audio.loadSound("phatbouncedie1.mp3", "die1");
					audio.loadSound("phatbounceexplode.mp3", "explode");
					audio.loadSound("phatbouncescore.mp3", "score");
					audio.loadSound("phatbouncespawn1.mp3", "spawn1");
				} else {
					/* If the Web audio API isn't supported, we don't load any sounds, so subtract them from the total assets. */
					this.total_assets -= 8;
				}
				graphics.loadImage("phatbounceaboutbutton.png", "about_button");
				graphics.loadImage("phatbouncebackbutton.png", "back_button");
				graphics.loadImage("phatbounceball.png", "ball");
				graphics.loadImage("phatbouncebluewins.png", "blue_wins");
				graphics.loadImage("phatbounceleftrighttoggle.png", "left_right_toggle");
				graphics.loadImage("phatbouncepaddleleft.png", "paddle_left");
				graphics.loadImage("phatbouncepaddleright.png", "paddle_right");
				graphics.loadImage("phatbounceranksbutton.png", "ranks_button");
				graphics.loadImage("phatbounceredwins.png", "red_wins");
				graphics.loadImage("phatbounceresetbutton.png", "reset_button");
				graphics.loadImage("phatbouncesoundtoggle.png", "sound_toggle");
				graphics.loadImage("phatbouncestart.png", "start");
				graphics.loadImage("phatbouncestartbutton.png", "start_button");
				graphics.loadImage("phatbouncetext.png", "text");
				graphics.loadImage("phatbouncetitle.png", "title");
			},
			/* Stop load. */
			stop : function() {
				return;
			},
			/* Update load. */
			update : function() {
				this.assets_loaded++;
				this.render();
				if (this.assets_loaded == this.total_assets) {
					window.removeEventListener("accountforasset", accountForAssetWindow);

					/* Once everything is loaded up, you can start the game! */
					switchState(start);
				}
			},
			/* VARIABLES. */
			/* How many assets have been loaded. */
			assets_loaded : 0,
			bar_padding : 1,
			total_assets : 23,
		};

		/* Play game state. */
		var play = {
			/* FUNCTIONS. */
			/* Render play. */
			render : function(time_step_) {
				buffer.fillStyle = this.background_color.getRGBColor();
				buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

				for ( index = this.ball_manager.balls.length - 1; index > -1; index--) {
					this.ball_manager.balls[index].render(time_step_);
				}

				this.paddle_left.render(time_step_);
				this.paddle_right.render(time_step_);

				for (var index = this.particle_manager.particles.length - 1; index > -1; index--) {
					var particle = this.particle_manager.particles[index];
					particle.render();
				}

				this.bar_left.render();
				this.bar_right.render();
			},
			resize : function() {
				if (client_height > client_width) {
					switchState(tilt);
				} else {
					formatDisplay();
				}
			},

			/* Start play. */
			start : function() {
				window.addEventListener("touchmove", touchMoveWindow, false);
				window.addEventListener("touchstart", touchStartWindow, false);

				if (!this.game_in_progress) {
					this.game_in_progress = true;
					this.ball_manager.balls = new Array();
					this.ball_manager.placeBallByPaddle(this.use_left_paddle);

					this.bar_left.format(0, this.stage_height - 10, 0, 10);
					this.bar_right.format(this.stage_width, 0, 0, 10);

					this.paddle_left.format(4, this.stage_height * 0.5 - this.paddle_left.height * 0.5, this.stage_height * 0.5 - this.paddle_left.height * 0.5);
					this.paddle_right.format(this.stage_width - this.paddle_right.width - 4, this.stage_height * 0.5 - this.paddle_right.height * 0.5, this.stage_height * 0.5 - this.paddle_right.height * 0.5);

					if (this.use_left_paddle) {
						this.paddle_opponent = this.paddle_right;
						this.paddle_player = this.paddle_left;
					} else {
						this.paddle_opponent = this.paddle_left;
						this.paddle_player = this.paddle_right;
					}
				}

				fixed_engine.start(1000 / 60);
			},
			/* Stop play. */
			stop : function() {
				window.removeEventListener("touchmove", touchMoveWindow);
				window.removeEventListener("touchstart", touchStartWindow);

				fixed_engine.stop();
			},
			/* Score some pOOOOOOOOOOINTS, SOOOOON!!!!! */
			/* Returns true if update should break out of the ball loop. */
			testScore : function(ball_, response_, index_) {
				if (response_ != 0) {
					if (this.ball_manager.balls.length < 2) {
						audio.playSound("die1", 0, false);
						this.ball_manager.placeBallInCenter(true, ball_);
						this.particle_manager.activateParticleSpiral(this.stage_width * 0.5, this.stage_height * 0.5, 12, "#00f000", 0.5, 12);
					} else {
						audio.playSound("score", 0, false);
						this.ball_manager.pool.take(this.ball_manager.balls, index_);
					}
					if (response_ == 1) {
						this.bar_left.advanceRight(30, ball_);
						this.background_color.increaseRed(40);
					} else if (response_ == 2) {
						this.bar_right.advanceLeft(30, ball_);
						this.background_color.increaseBlue(40);
					}

					if (this.bar_left.width > this.stage_width) {
						for (var ball_index = this.ball_manager.balls.length - 1; ball_index > -1; ball_index--) {
							var ball = this.ball_manager.balls[ball_index];
							this.particle_manager.activateParticleBoom(ball.getMeanX(), ball.getMeanY(), 12, "#00f000", 5);
						}
						audio.playSound("cool_beat", 0);
						end.left_wins = true;
						this.ball_manager.recallBalls();
						return true;
					}
					if (this.bar_right.width > this.stage_width) {
						for (var ball_index = this.ball_manager.balls.length - 1; ball_index > -1; ball_index--) {
							var ball = this.ball_manager.balls[ball_index];
							this.particle_manager.activateParticleBoom(ball.getMeanX(), ball.getMeanY(), 12, "#00f000", 5);
						}
						audio.playSound("cool_beat", 0);
						end.left_wins = false;
						this.ball_manager.recallBalls();
						return true;
					}
				}
				return false;
			},
			touchMove : function(x_, y_) {
				this.paddle_player.target_y = y_;
			},
			/* TouchStart play. */
			touchStart : function(x_, y_) {
				this.touchMove(x_, y_);
			},
			update : function() {
				if (this.ball_manager.balls.length === 0 && this.particle_manager.particles.length === 0) {
					switchState(end);
				}
				for (var index = this.particle_manager.particles.length - 1; index > -1; index--) {
					var particle = this.particle_manager.particles[index];
					particle.update();
					this.particle_manager.testParticle(particle, index);
				}

				this.paddle_opponent.findTarget(this.ball_manager.balls);

				this.paddle_left.update();
				this.paddle_right.update();
				/* Ball loop. */
				for (var index = this.ball_manager.balls.length - 1; index > -1; index--) {
					var ball = this.ball_manager.balls[index];

					ball.update();

					if (this.collision_manager.collideBallWithCeiling(ball)) {
						if (this.wallBounce(ball, index)) {
							continue;
						}
					} else if (this.collision_manager.collideBallWithFloor(ball)) {
						if (this.wallBounce(ball, index)) {
							continue;
						}
					}

					if (this.collision_manager.collideBallWithLeftPaddle(ball, this.paddle_left)) {
						audio.playSound("collision_c4", 0, false);
						this.background_color.increaseRed(40);
						this.particle_manager.activateParticleRicochet(ball.position.x, ball.getMeanY(), 8, "#f00000", ball.direction, ball.velocity, 3);

						if (ball.velocity > 2.5) {
							audio.playSound("spawn1", 0, false);
							this.particle_manager.activateParticleSpiral(ball.getMeanX(), ball.getMeanY(), 12, "#00f000", -0.5, 12);
							ball.velocity *= 0.5;
							this.ball_manager.placeBallByBall(ball);
						}
					} else if (this.collision_manager.collideBallWithRightPaddle(ball, this.paddle_right)) {
						audio.playSound("collision_c4mid", 0, false);
						this.background_color.increaseBlue(40);
						this.particle_manager.activateParticleRicochet(ball.getMaximumX(), ball.getMeanY(), 8, "#0000f0", ball.direction, ball.velocity, 3);

						if (ball.velocity > 2.5) {
							audio.playSound("spawn1", 0, false);
							this.particle_manager.activateParticleSpiral(ball.getMeanX(), ball.getMeanY(), 12, "#00f000", -0.5, 12);
							ball.velocity *= 0.5;
							this.ball_manager.placeBallByBall(ball);
						}
					}

					/* If this returns true, game over. All balls will be removed, so break out of ball loop. */
					if (this.testScore(ball, this.collision_manager.testBallOutOfBounds(ball), index)) {
						break;
					}
				}

				this.background_color.fadeToBlack(0.001);
			},
			wallBounce : function(ball_, index_) {
				audio.playSound("collision_c5", 0, false);
				this.background_color.increaseAll(10);
				this.particle_manager.activateParticleRicochet(ball_.getMeanX(), ball_.getMaximumY(), 8, "#f0f0f0", ball_.direction, ball_.velocity, 3);
				if (ball_.velocity > 3) {
					audio.playSound("explode", 0, false);
					this.particle_manager.activateParticleRicochet(ball_.getMeanX(), ball_.getMeanY(), 12, "#f0f0f0", ball_.direction, ball_.velocity * 3, 12);
					var left = Boolean(ball_.getVelocityX() > 0);
					if (!left) {
						this.bar_right.advanceLeft(20, ball_);
					} else {
						this.bar_left.advanceRight(20, ball_);
					}
					if (this.ball_manager.balls.length > 1) {
						this.ball_manager.pool.take(this.ball_manager.balls, index_);
						return true;
					} else {
						this.ball_manager.placeBallInCenter(left, ball_);
					}
				}
				return false;
			},
			/* OBJECT LITERALS. */
			ball_manager : {
				/* FUNCTIONS. */
				placeBallByBall : function(ball_) {
					var ball = this.pool.produce();
					ball.format(ball_.position.x, ball_.position.y, ball_.direction + Math.random() - 0.5, ball_.velocity);
					this.balls.push(ball);
				},
				placeBallByPaddle : function(left_, ball_) {
					var ball = ball_ || this.pool.produce();
					ball.format( left_ ? 20 : play.stage_width - 20 - Ball.prototype.width, play.stage_height * 0.5 - Ball.prototype.height, left_ ? Math.PI : 0, 1);
					if (!ball_) {
						this.balls.push(ball);
					}
				},
				placeBallInCenter : function(left_, ball_) {
					var ball = ball_ || this.pool.produce();
					ball.format(play.stage_width * 0.5 - Ball.prototype.width, play.stage_height * 0.5 - Ball.prototype.height, left_ ? Math.PI : 0, 1);
					if (!ball_) {
						this.balls.push(ball);
					}
				},
				recallBalls : function() {
					for (var ball_index = this.balls.length - 1; ball_index > -1; ball_index--) {
						this.pool.take(this.balls, ball_index);

					}
				},
				/* VARIABLES. */
				balls : new Array(),
				pool : new Pool(Ball)
			},
			collision_manager : {
				/* FUNCTIONS. */
				/* Handles ball collision with ceiling. */
				collideBallWithCeiling : function(ball_) {
					if (ball_.position.y < 0) {
						var ball_vector = ball_.getMovementVector();
						ball_.direction = Math.atan2(ball_vector.y - 2 * ball_vector.y, ball_vector.x);
						ball_.position.y = ball_.last_position.y = 0;
						ball_.source_x = 0;
						ball_.velocity += 0.2;
						return true;
					}
					return false;
				},
				/* Handles ball collision with floor. */
				collideBallWithFloor : function(ball_) {
					if (ball_.getMaximumY() > game.stage_height) {
						var ball_vector = ball_.getMovementVector();
						ball_.direction = Math.atan2(ball_vector.y - 2 * ball_vector.y, ball_vector.x);
						ball_.position.y = ball_.last_position.y = game.stage_height - ball_.height;
						ball_.source_x = 0;
						ball_.velocity += 0.2;
						return true;
					}
					return false;
				},
				/* Collides a ball with a left paddle. */
				collideBallWithLeftPaddle : function(ball_, paddle_) {
					if (ball_.getMaximumY() < paddle_.position.y || ball_.position.y > paddle_.getMaximumY()) {
						return false;
					}
					if (ball_.position.x < paddle_.getMaximumX() && ball_.last_position.x >= paddle_.getMaximumX()) {
						var ball_vector = ball_.getMovementVector();
						ball_.direction = Math.atan2(ball_vector.y + paddle_.velocity_y * 0.2, ball_vector.x - 2 * ball_vector.x);
						ball_.last_position.x = ball_.position.x = paddle_.getMaximumX();
						ball_.source_x = 10;
						ball_.velocity += 0.1;
						paddle_.takeHit();
						return true;
					}
					return false;
				},
				/* Collides a ball with a right paddle. */
				collideBallWithRightPaddle : function(ball_, paddle_) {
					if (ball_.getMaximumY() < paddle_.position.y || ball_.position.y > paddle_.getMaximumY()) {
						return false;
					}
					if (ball_.getMaximumX() > paddle_.position.x && ball_.last_position.x + ball_.width <= paddle_.position.x) {
						var ball_vector = ball_.getMovementVector();
						ball_.direction = Math.atan2(ball_vector.y + paddle_.velocity_y * 0.2, ball_vector.x - 2 * ball_vector.x);
						ball_.last_position.x = ball_.position.x = paddle_.position.x - ball_.width;
						ball_.source_x = 20;
						ball_.velocity += 0.1;
						paddle_.takeHit();
						return true;
					}
					return false;
				},
				/* Tests to see if the ball is out of bounds. */
				testBallOutOfBounds : function(ball_) {
					if (ball_.position.x > game.stage_width) {
						return 1;
					} else if (ball_.getMaximumX() < 0) {
						return 2;
					}
					return 0;
				}
				/* VARIABLES. */
			},
			particle_manager : {
				/* FUNCTIONS. */
				activateParticleBoom : function(x_, y_, size_, color_, number_) {
					for (var count = 0; count < number_; count++) {
						var particle = this.pool.produce();
						particle.format(x_ - size_ * 0.5, y_ - size_ * 0.5, size_, color_, Math.random() * Math.PI * 2, Math.random() * 3 + 1);
						this.particles.push(particle);
					}
				},
				activateParticleRicochet : function(x_, y_, size_, color_, direction_, velocity_, number_) {
					for (var count = 0; count < number_; count++) {
						var particle = this.pool.produce();
						particle.format(x_ - size_ * 0.5, y_ - size_ * 0.5, size_, color_, direction_ + Math.random() * 2 - 1, Math.random() * (velocity_ * 0.5) + 1);
						this.particles.push(particle);
					}
				},
				activateParticleSpiral : function(x_, y_, size_, color_, velocity_, number_) {
					var radian = Math.PI * 2 / number_;
					var start_rotation = Math.random() * Math.PI * 2;

					for (var count = 0; count < number_; count++) {
						var particle = this.pool.produce();
						particle.format(x_ - size_ * 0.5, y_ - size_ * 0.5, size_, color_, start_rotation + radian * count, velocity_ * count);
						this.particles.push(particle);
					}
				},
				testParticle : function(particle_, index_) {
					if (particle_.size < 1) {
						this.pool.take(this.particles, index_);
						return true;
					}
					return false;
				},
				/* VARIABLES. */
				particles : new Array(),
				pool : new Pool(Particle)
			},
			/* VARIABLES. */
			background_color : new Color(0, 0, 0),
			bar_left : new Bar(0, 230, 0, 10, "rgba(176,0,0,0.5)"),
			bar_right : new Bar(480, 0, 0, 10, "rgba(0,0,176,0.5)"),
			game_in_progress : false,
			paddle_left : new Paddle(0, 0, 0, "paddle_left"),
			paddle_opponent : undefined,
			paddle_player : undefined,
			paddle_right : new Paddle(0, 0, 0, "paddle_right"),
			stage_height : 240,
			stage_width : 480,
			use_left_paddle : true
		};

		/* Start game state. */
		var start = {
			/* FUNCTIONS. */
			/* Render start. */
			render : function() {
				buffer.fillStyle = "#000000";
				buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

				this.title.render();
				this.about_button.render();
				this.ranks_button.render();
				this.sound_toggle.render();
				this.start_button.render();

				this.text.render();
				this.left_right_toggle.render();

				display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
			},
			/* Resize the start game state. */
			resize : function() {
				if (client_height > client_width) {
					switchState(tilt);
				} else {
					formatDisplay();
					this.render();
				}
			},
			/* Starts the start game state. */
			start : function() {
				this.about_button.times_touched = 0;
				this.start_button.times_touched = 0;
				this.text.parseMessage("A GAME BY FRANK POTH``PRESS START TO PLAY``PRESS ABOUT TO READ MORE``PRESS SOUND TO TOGGLE AUDIO");
				window.addEventListener("touchstart", touchStartWindow, false);
				resizeWindow();
			},
			/* Stops the start game state. */
			stop : function() {
				window.removeEventListener("touchstart", touchStartWindow);
			},
			/* Press those invisible buttons! */
			touchStart : function(x_, y_) {
				if (this.about_button.test(x_, y_)) {
					this.about_button.times_touched = this.about_button.times_touched < 3 ? this.about_button.times_touched + 1 : 1;

					if (this.about_button.times_touched === 1) {
						this.text.parseMessage("TILT THE SCREEN TO PAUSE YOUR GAME AT ANY TIME``A RESET OPTION IS AVAILABLE ON THE PAUSE MENU``THE ABOUT BUTTON CAN BE PRESSED MORE THAN ONCE");
					} else if (this.about_button.times_touched === 2) {
						this.text.parseMessage("GET BALLS THROUGH YOUR OPPONENTS GOAL TO SCORE POINTS``POINTS ARE ALSO AWARDED FOR BOUNCING A BALL OFF THE WALLS MULTIPLE TIMES UNTIL IT EXPLODES");
					} else if (this.about_button.times_touched === 3) {
						this.text.parseMessage("THE FIRST PLAYER TO FILL THEIR SCORE BAR WINS BUT BE WARNED THE CPU PADDLE IS INSANELY GOOD AT THIS``IT WILL BEAT YOU``IT IS UNSTOPPABLE");
					}
				}
				if (!play.game_in_progress && this.left_right_toggle.test(x_, y_)) {
					play.use_left_paddle = this.left_right_toggle.source_x == 0 ? true : false;
				}
				if (this.ranks_button.test(x_, y_)) {
					this.text.parseMessage("RANKS HAVE NOT YET BEEN IMPLEMENTED");
				}
				if (this.sound_toggle.test(x_, y_)) {
					audio.enabled = !audio.enabled;
					if (audio.enabled) {
						this.text.parseMessage("SOUND ENABLED");
					} else {
						this.text.parseMessage("SOUND DISABLED");
					}
				}
				if (this.start_button.test(x_, y_)) {
					this.start_button.times_touched++;
					if (play.game_in_progress || this.start_button.times_touched == 2) {
						switchState(play);
						return;
					}

					this.text.parseMessage("YOU CAN PLAY AS THE LEFT OR RIGHT PADDLE SO SELECT THE SIDE OF YOUR CHOICE BEFORE HITTING START AGAIN TO PLAY``FOR THE BEST GAMEPLAY EXPERIENCE CHOOSE THE SIDE OPPOSITE YOUR DOMINANT HAND");
				}

				this.render();
			},
			/* OBJECT LITERALS. */
			start_button : {
				/* VARIABLES. */
				times_clicked : 0
			},
			/* VARIABLES. */
			about_button : new Button(320, 5, 155, 45, false, "about_button"),
			left_right_toggle : new Button(5, 190, 155, 45, true, "left_right_toggle"),
			ranks_button : new Button(320, 65, 155, 45, false, "ranks_button"),
			sound_toggle : new Button(320, 130, 155, 45, true, "sound_toggle"),
			stage_height : 240,
			stage_width : 480,
			start_button : new Button(320, 190, 155, 45, false, "start_button"),
			text : new TextField(5, 64, 310, 126, 5, 7, 2, 1, 2, "text"),
			title : new Graphic(5, 5, 310, 45, "title")
		};

		/* Tilt. */
		/* This is what needs to run whenever the user's screen isn't properly sized. */
		var tilt = {
			/* FUNCTIONS. */
			/* Render tilt. */
			render : function() {
				buffer.fillStyle = "#000000";
				buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

				this.text.render();
				this.reset_button.render();

				display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
			},
			/* Resize tilt. */
			resize : function() {
				if (client_width > client_height) {
					switchState(start);
				} else {
					formatDisplay();
					this.render();
				}
			},
			/* Start tilt. */
			start : function() {
				if (play.game_in_progress) {
					this.text.parseMessage("TILT YOUR DEVICE AND PRESS START TO RESUME GAMEPLAY``PRESS RESET TO TERMINATE YOUR CURRENT GAME");
				} else {
					this.text.parseMessage("TILT YOUR DEVICE AND PRESS START TO START A NEW GAME");
				}
				this.reset_button.times_touched = 0;
				window.addEventListener("touchstart", touchStartWindow, false);
				resizeWindow();
			},
			/* Stop tilt. */
			stop : function() {
				window.removeEventListener("touchstart", touchStartWindow);
			},
			/* Touchstart tilt. */
			touchStart : function(x_, y_) {
				if (play.game_in_progress && this.reset_button.test(x_, y_)) {
					this.reset_button.times_touched++;
					if (this.reset_button.times_touched == 1) {
						this.text.parseMessage("PRESS RESET ONCE MORE TO TERMINATE YOUR CURRENT GAME OR TILT YOUR DEVICE AND PRESS START TO RESUME GAMEPLAY");
					} else if (this.reset_button.times_touched == 2) {
						play.game_in_progress = false;
						this.text.parseMessage("GAME RESET``TILT YOUR DEVICE AND PRESS START TO PLAY AGAIN!");
					}
				}
				this.render();
			},
			/* Variables. */
			reset_button : new Button(22.5, 151, 155, 45, false, "reset_button"),
			stage_height : 200,
			stage_width : 200,
			text : new TextField(0, 0, 200, 200, 5, 7, 2, 1, 2, "text")
		};

		/////////////////
		/* VARIABLES. */
		///////////////

		/* Draw stuff to the buffer before drawing it to the display. */
		var buffer = document.createElement("canvas").getContext("2d");

		/* The width and height of the client window. */
		var client_width = undefined;
		var client_height = undefined;

		/* The display canvas/context. */
		var display = document.getElementById("canvas").getContext("2d");

		/* The physical location of the display canvas for use with input scaling. */
		var display_left = undefined;
		var display_top = undefined;

		/* The current game state; starts out with load. */
		var game = load;

		/* The current client window to stage ratios. */
		var height_ratio = undefined;
		var size_ratio = undefined;
		var width_ratio = undefined;

		//////////////////
		/* INITIALIZE. */
		////////////////
		display.canvas.style.position = "fixed";

		window.addEventListener("accountforasset", accountForAssetWindow, false);
		window.addEventListener("resize", resizeWindow, false);

		game.start();
	})();
