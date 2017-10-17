describe('flexDetect', () => {
	let fakeDocNoFlex;
	let fakeDocHasFlex;

	beforeEach((done) => {
		fakeDocNoFlex = {
			createElement: (arg) => {
				return {
					style: {
						flex: undefined
					}
				};
			}
		};
		fakeDocHasFlex = {
			createElement: (arg) => {
				return {
					style: {
						flex: true
					}
				};
			}
		};

		$('body').removeClass('no-flex');
		done();
	});

	it('should not detect flexbox', () => {
		bcpl.utility.flexDetect.init(fakeDocNoFlex);

		expect($('body').hasClass('no-flex')).toBe(true);
	});

	it('should detect flexbox', () => {
		bcpl.utility.flexDetect.init(fakeDocHasFlex);

		expect($('body').hasClass('no-flex')).toBe(false);
	});
});
